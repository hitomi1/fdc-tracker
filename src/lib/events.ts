import type { DraftEvent, Filters, SortState } from '../types';
import { MAX_LOSSES, MAX_WINS, TROPHY_WINS } from '../data/formats';
import { FORMAT_TO_REWARD_KEY, REWARDS_LOOKUP, type RewardRow } from '../data/rewards';

export type ResultKind = 'trophy' | 'win' | 'loss';

export function isTrophy(event: DraftEvent): boolean {
  const needed = TROPHY_WINS[event.format] ?? 7;
  return event.wins >= needed && event.losses === 0;
}

export function resultLabel(event: DraftEvent): ResultKind {
  const needed = TROPHY_WINS[event.format] ?? 7;
  if (isTrophy(event)) return 'trophy';
  if (event.wins >= needed) return 'win';
  // losses == max allowed and wins < trophy → loss
  const maxL = MAX_LOSSES[event.format] ?? 3;
  if (event.losses >= maxL) return 'loss';
  // still in progress or finished with positive record
  const maxW = MAX_WINS[event.format] ?? 7;
  if (event.wins >= Math.ceil(maxW / 2)) return 'win';
  return 'loss';
}

export function mainColorsOf(ev: DraftEvent) {
  return ev.mainColors ?? ev.colors ?? [];
}

export function splashColorsOf(ev: DraftEvent) {
  return ev.splashColors ?? [];
}

// ─── Rewards ──────────────────────────────────────────────────────────────────

export function getRewardRow(ev: DraftEvent): RewardRow | null {
  const key = FORMAT_TO_REWARD_KEY[ev.format];
  if (!key) return null;
  return REWARDS_LOOKUP[key]?.[`${ev.wins}-${ev.losses}`] ?? null;
}

export function getNetGem(ev: DraftEvent): number | null {
  return getRewardRow(ev)?.netGem ?? null;
}

export function fmtGem(val: number | null): string {
  if (val === null) return '—';
  return (val >= 0 ? '+' : '') + val.toLocaleString();
}

// ─── Dates ────────────────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(iso: string): string {
  if (!iso) return '—';
  const dt = new Date(iso);
  if (isNaN(dt.getTime())) return iso;
  const time = iso.includes('T')
    ? ` ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
    : '';
  return `${MONTHS[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}${time}`;
}

export function formatDateShort(iso: string): string {
  if (!iso) return '—';
  const dt = new Date(iso);
  if (isNaN(dt.getTime())) return iso;
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  const yy = String(dt.getFullYear()).slice(2);
  const time = iso.includes('T')
    ? ` ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
    : '';
  return `${mm}/${dd}/${yy}${time}`;
}

export function todayISO(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function generateId(): string {
  return 'ev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
}

// ─── Filters & sort ───────────────────────────────────────────────────────────

export function applyFilters(events: DraftEvent[], filters: Filters): DraftEvent[] {
  return events.filter(ev => {
    if (filters.format && ev.format !== filters.format) return false;
    if (filters.set && ev.set !== filters.set) return false;
    if (filters.dateFrom && ev.date < filters.dateFrom) return false;
    if (filters.dateTo && ev.date > filters.dateTo) return false;
    return true;
  });
}

export function applySort(events: DraftEvent[], sort: SortState): DraftEvent[] {
  const { col, dir } = sort;
  return [...events].sort((a, b) => {
    const av = a[col];
    const bv = b[col];
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface Stats {
  total: number;
  winRate: number | null;
  trophyRate: number | null;
  avgRecord: string | null;
  games: number;
  trophies: number;
  totalWins: number;
  totalLosses: number;
}

export function calcStats(events: DraftEvent[]): Stats {
  if (!events.length) {
    return { total: 0, winRate: null, trophyRate: null, avgRecord: null, games: 0, trophies: 0, totalWins: 0, totalLosses: 0 };
  }
  const total = events.length;
  let totalWins = 0;
  let totalLosses = 0;
  let trophies = 0;

  for (const ev of events) {
    totalWins += ev.wins;
    totalLosses += ev.losses;
    if (isTrophy(ev)) trophies++;
  }

  const games = totalWins + totalLosses;
  const winRate = games > 0 ? (totalWins / games) * 100 : null;
  const trophyRate = total > 0 ? (trophies / total) * 100 : null;
  const avgW = (totalWins / total).toFixed(1);
  const avgL = (totalLosses / total).toFixed(1);

  return { total, winRate, trophyRate, avgRecord: `${avgW}–${avgL}`, games, trophies, totalWins, totalLosses };
}
