import type { Color, DraftEvent, EventFormat } from '../types';
import { SETS_DATA } from '../data/sets';

// Parses the "copy" output from a 17Lands draft history table into draft events.
//
// A pasted block looks like (columns are tab-separated when copied from the site):
//
//   Date            Account  Set  Trophy  Colors  W/L    Format        Start Rank  End Rank  Shareable Links
//   2026-06-21 20:22  Hitomi   SOS  x       WB      4 - 1  PickTwoDraft  Diamond-4   Diamond-3
//   Draft
//   Picks
//   …
//
// The "Shareable Links" cell renders as its own lines (Draft / Picks / Pool /
// Deck 1 / Details …). Those lines don't start with a date, so we skip them.
// Within a row we identify each field by what it looks like rather than by its
// column index, so the parser tolerates blank cells collapsing under whitespace.

export type ParsedEvent = Omit<DraftEvent, 'id'>;

export interface ParseResult {
  events: ParsedEvent[];
  errors: string[];
}

// 17Lands format names (no spaces) → our EventFormat.
const FORMAT_MAP: Record<string, EventFormat> = {
  premierdraft: 'Premier Draft',
  quickdraft: 'Quick Draft',
  traddraft: 'Traditional Draft',
  traditionaldraft: 'Traditional Draft',
  picktwodraft: 'PickTwoDraft',
  sealed: 'Sealed',
  tradsealed: 'Traditional Sealed',
  traditionalsealed: 'Traditional Sealed',
  cubedraft: 'Cube Draft',
  phantomdraft: 'Phantom Draft',
  contenderdraft: 'Contender Draft',
  directdraft: 'Direct Draft',
};

const KNOWN_SETS = new Set(SETS_DATA.map(s => s.code.toUpperCase()));
const RANK_RE = /^(?:(?:Bronze|Silver|Gold|Platinum|Diamond)-[1-4]|Mythic)$/i;
const DATE_RE = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/;
const RECORD_RE = /^(\d+)\s*-\s*(\d+)$/;

// Uppercase letters are main colors, lowercase are splash colors — this matches
// 17Lands' convention (e.g. "URbg" = main U/R, splash B/G).
function parseColors(token: string): { main: Color[]; splash: Color[] } | null {
  const main: Color[] = [];
  const splash: Color[] = [];
  for (const ch of token) {
    const up = ch.toUpperCase();
    if (!'WUBRG'.includes(up)) return null;
    if (ch === up) main.push(up as Color);
    else splash.push(up as Color);
  }
  if (!main.length && !splash.length) return null;
  return { main, splash };
}

function normalizeFormat(token: string): EventFormat | null {
  return FORMAT_MAP[token.toLowerCase().replace(/[\s_-]/g, '')] ?? null;
}

export function parse17Lands(text: string): ParseResult {
  const events: ParsedEvent[] = [];
  const errors: string[] = [];

  const lines = text.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    const dateMatch = line.match(DATE_RE);
    if (!dateMatch) continue; // header, link rows, blanks

    // Split on tabs, or runs of 2+ spaces, so the "4 - 1" record stays intact.
    const tokens = line.split(/\t+|\s{2,}/).map(t => t.trim()).filter(Boolean);

    let set = '';
    let colors: { main: Color[]; splash: Color[] } | null = null;
    let record: { wins: number; losses: number } | null = null;
    let format: EventFormat | null = null;
    const ranks: string[] = [];

    for (const token of tokens) {
      if (DATE_RE.test(token)) continue; // the date itself

      const rec = token.match(RECORD_RE);
      if (rec) {
        record = { wins: parseInt(rec[1], 10), losses: parseInt(rec[2], 10) };
        continue;
      }
      if (RANK_RE.test(token)) {
        ranks.push(token);
        continue;
      }
      const fmt = normalizeFormat(token);
      if (fmt) {
        format = fmt;
        continue;
      }
      if (!set && KNOWN_SETS.has(token.toUpperCase())) {
        set = token.toUpperCase();
        continue;
      }
      if (!colors) {
        const parsed = parseColors(token);
        if (parsed) {
          colors = parsed;
          continue;
        }
      }
      // anything else (account name, trophy "x", empty link cell) is ignored
    }

    const date = `${dateMatch[1]}T${dateMatch[2]}`;

    if (!record) {
      errors.push(`Skipped "${line}" — no W/L record found.`);
      continue;
    }
    if (!set) {
      errors.push(`Skipped "${line}" — unrecognized set.`);
      continue;
    }
    if (!format) {
      errors.push(`Skipped "${line}" — unrecognized format.`);
      continue;
    }

    events.push({
      date,
      format,
      set,
      wins: record.wins,
      losses: record.losses,
      mainColors: colors?.main ?? [],
      splashColors: colors?.splash ?? [],
      startRank: ranks[0] ?? '',
      endRank: ranks[1] ?? ranks[0] ?? '',
      notes: '',
      deckCode: '',
    });
  }

  return { events, errors };
}

// Two events are "the same" run if they share date, set, format and record.
export function eventKey(ev: { date: string; set: string; format: string; wins: number; losses: number }): string {
  return `${ev.date}|${ev.set}|${ev.format}|${ev.wins}-${ev.losses}`;
}
