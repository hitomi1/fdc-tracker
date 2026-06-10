import { useEffect, useMemo, useRef, useState } from 'react';
import type { Color, DraftEvent, EventFormat } from '../types';
import { COLORS, COLOR_NAMES, FORMATS, MAX_LOSSES, MAX_WINS, RANKS, TROPHY_WINS } from '../data/formats';
import { SETS_DATA } from '../data/sets';
import { todayISO } from '../lib/events';

type ColorState = 'none' | 'main' | 'splash';

interface FormState {
  date: string;
  format: EventFormat;
  set: string;
  wins: number;
  losses: number;
  colorStates: Record<Color, ColorState>;
  startRank: string;
  endRank: string;
  notes: string;
  deckCode: string;
}

interface Props {
  editing: DraftEvent | null;
  onClose: () => void;
  onSave: (data: Omit<DraftEvent, 'id'>) => void;
}

const NO_COLORS: Record<Color, ColorState> = { W: 'none', U: 'none', B: 'none', R: 'none', G: 'none' };

function initialForm(editing: DraftEvent | null): FormState {
  if (!editing) {
    return {
      date: todayISO(),
      format: 'Premier Draft',
      set: SETS_DATA[0]?.code ?? '',
      wins: 0,
      losses: 0,
      colorStates: { ...NO_COLORS },
      startRank: '',
      endRank: '',
      notes: '',
      deckCode: '',
    };
  }
  const main = editing.mainColors ?? editing.colors ?? [];
  const splash = editing.splashColors ?? [];
  const colorStates = { ...NO_COLORS };
  for (const c of main) colorStates[c] = 'main';
  for (const c of splash) colorStates[c] = 'splash';
  return {
    date: editing.date || todayISO(),
    format: editing.format || 'Premier Draft',
    set: editing.set || '',
    wins: editing.wins ?? 0,
    losses: editing.losses ?? 0,
    colorStates,
    startRank: editing.startRank || '',
    endRank: editing.endRank || '',
    notes: editing.notes || '',
    deckCode: editing.deckCode || '',
  };
}

export function EventModal({ editing, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormState>(() => initialForm(editing));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dateRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const maxW = MAX_WINS[form.format] ?? 7;
  const maxL = MAX_LOSSES[form.format] ?? 3;
  const trophyW = TROPHY_WINS[form.format] ?? 7;

  const wins = Math.min(form.wins, maxW);
  const losses = Math.min(form.losses, maxL);

  const recordPreview = useMemo(() => {
    let label = `${wins}–${losses}`;
    if (wins >= trophyW && losses === 0) label += ' 🏆 Trophy!';
    else if (wins >= trophyW) label += ' — Win';
    else if (losses >= maxL) label += ' — Loss';
    return label;
  }, [wins, losses, trophyW, maxL]);

  const set = (patch: Partial<FormState>) => setForm(f => ({ ...f, ...patch }));

  const adjust = (field: 'wins' | 'losses', delta: number) => {
    const max = field === 'wins' ? maxW : maxL;
    set({ [field]: Math.min(max, Math.max(0, (field === 'wins' ? wins : losses) + delta)) });
  };

  const cycleColor = (c: Color) => {
    const cur = form.colorStates[c];
    const next: ColorState = cur === 'none' ? 'main' : cur === 'main' ? 'splash' : 'none';
    set({ colorStates: { ...form.colorStates, [c]: next } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.date) errs.date = 'Date is required.';
    if (!form.format) errs.format = 'Format is required.';
    if (!form.set) errs.set = 'Set code is required.';
    if (isNaN(wins) || wins < 0) errs.wins = 'Invalid wins.';
    if (isNaN(losses) || losses < 0) errs.losses = 'Invalid losses.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const mainColors = COLORS.filter(c => form.colorStates[c] === 'main');
    const splashColors = COLORS.filter(c => form.colorStates[c] === 'splash');

    onSave({
      date: form.date.trim(),
      format: form.format,
      set: form.set.trim().toUpperCase(),
      wins,
      losses,
      mainColors,
      splashColors,
      startRank: form.startRank,
      endRank: form.endRank,
      notes: form.notes.trim(),
      deckCode: form.deckCode.trim(),
    });
  };

  const fieldCls = (key: string) => 'field' + (errors[key] ? ' error' : '');
  const hintStyle: React.CSSProperties = {
    fontWeight: 400, textTransform: 'none', fontSize: '0.65rem',
    color: 'var(--text-muted)', marginLeft: 4,
  };

  return (
    <div
      id="modal-overlay"
      className="visible"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <div className="modal-handle" aria-hidden="true" />

        <div className="modal-header">
          <h2 id="modal-title">{editing ? 'Edit Event' : 'New Event'}</h2>
          <button className="btn btn-icon btn-ghost" aria-label="Close dialog" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p id="modal-desc" className="sr-only">
            Fill in the details of your draft event and tap "Add Event" to save.
          </p>

          <form id="modal-form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <div className="form-grid">

              {/* Date */}
              <div className={fieldCls('date')}>
                <label htmlFor="field-date">Date <span className="required" aria-hidden="true">*</span></label>
                <input
                  ref={dateRef}
                  type="datetime-local"
                  id="field-date"
                  required
                  aria-required="true"
                  value={form.date}
                  onChange={e => set({ date: e.target.value })}
                />
                <span className="error-msg" role="alert">{errors.date}</span>
              </div>

              {/* Format */}
              <div className={fieldCls('format')}>
                <label htmlFor="field-format">Format <span className="required" aria-hidden="true">*</span></label>
                <select
                  id="field-format"
                  required
                  aria-required="true"
                  value={form.format}
                  onChange={e => set({ format: e.target.value as EventFormat })}
                >
                  {FORMATS.map(f => <option key={f} value={f}>{f === 'PickTwoDraft' ? 'Pick Two Draft' : f}</option>)}
                </select>
                <span className="error-msg" role="alert">{errors.format}</span>
              </div>

              {/* Set */}
              <div className={fieldCls('set') + ' full'}>
                <label htmlFor="field-set">
                  Set <span className="required" aria-hidden="true">*</span>
                  <span style={hintStyle}>(e.g. FDN, DSK, BLB)</span>
                </label>
                <select
                  id="field-set"
                  required
                  aria-required="true"
                  value={form.set}
                  onChange={e => set({ set: e.target.value })}
                >
                  <option value="">Select set…</option>
                  {SETS_DATA.map(s => (
                    <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
                  ))}
                </select>
                <span className="error-msg" role="alert">{errors.set}</span>
              </div>

              {/* Wins */}
              <div className={fieldCls('wins')}>
                <label htmlFor="field-wins">Wins</label>
                <div className="number-stepper" role="group" aria-label="Wins">
                  <button type="button" aria-label="Decrease wins" onClick={() => adjust('wins', -1)}>−</button>
                  <input
                    type="number"
                    id="field-wins"
                    min={0}
                    max={maxW}
                    aria-label="Wins count"
                    value={wins}
                    onChange={e => set({ wins: Math.min(maxW, Math.max(0, parseInt(e.target.value, 10) || 0)) })}
                  />
                  <button type="button" aria-label="Increase wins" onClick={() => adjust('wins', 1)}>+</button>
                </div>
                <span className="error-msg" role="alert">{errors.wins}</span>
              </div>

              {/* Losses */}
              <div className={fieldCls('losses')}>
                <label htmlFor="field-losses">Losses</label>
                <div className="number-stepper" role="group" aria-label="Losses">
                  <button type="button" aria-label="Decrease losses" onClick={() => adjust('losses', -1)}>−</button>
                  <input
                    type="number"
                    id="field-losses"
                    min={0}
                    max={maxL}
                    aria-label="Losses count"
                    value={losses}
                    onChange={e => set({ losses: Math.min(maxL, Math.max(0, parseInt(e.target.value, 10) || 0)) })}
                  />
                  <button type="button" aria-label="Increase losses" onClick={() => adjust('losses', 1)}>+</button>
                </div>
                <span className="error-msg" role="alert">{errors.losses}</span>
              </div>

              {/* Record preview */}
              <div className="field full">
                <div className="record-preview" aria-live="polite" aria-atomic="true">
                  Record: <span className="preview-val">{recordPreview}</span>
                </div>
              </div>

              {/* Colors */}
              <div className="field full">
                <label>
                  Colors <span style={hintStyle}>1× main · 2× splash · 3× clear</span>
                </label>
                <div className="color-select" role="group" aria-label="Deck colors">
                  {COLORS.map(c => {
                    const cs = form.colorStates[c];
                    return (
                      <button
                        key={c}
                        type="button"
                        className={
                          'color-btn' +
                          (cs === 'main' ? ' color-main' : '') +
                          (cs === 'splash' ? ' color-splash' : '')
                        }
                        data-color={c}
                        aria-label={COLOR_NAMES[c]}
                        aria-pressed={cs !== 'none'}
                        title={`${COLOR_NAMES[c]} (${cs === 'none' ? 'unselected' : cs})`}
                        onClick={() => cycleColor(c)}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start Rank */}
              <div className="field">
                <label htmlFor="field-start-rank">Start Rank <span style={hintStyle}>(optional)</span></label>
                <select
                  id="field-start-rank"
                  value={form.startRank}
                  onChange={e => set({ startRank: e.target.value })}
                >
                  <option value="">— Select rank —</option>
                  {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* End Rank */}
              <div className="field">
                <label htmlFor="field-end-rank">End Rank <span style={hintStyle}>(optional)</span></label>
                <select
                  id="field-end-rank"
                  value={form.endRank}
                  onChange={e => set({ endRank: e.target.value })}
                >
                  <option value="">— Select rank —</option>
                  {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Notes */}
              <div className="field full">
                <label htmlFor="field-notes">Notes <span style={hintStyle}>(optional)</span></label>
                <textarea
                  id="field-notes"
                  placeholder="Key picks, deck notes, matchup observations…"
                  rows={3}
                  value={form.notes}
                  onChange={e => set({ notes: e.target.value })}
                />
              </div>

              {/* Deck code */}
              <div className="field full">
                <label htmlFor="field-deck-code">
                  Deck Code <span style={hintStyle}>(optional — paste from MTG Arena export)</span>
                </label>
                <textarea
                  id="field-deck-code"
                  placeholder="Paste your Arena deck export here…"
                  rows={4}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                  value={form.deckCode}
                  onChange={e => set({ deckCode: e.target.value })}
                />
              </div>

            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" type="submit" form="modal-form">
            {editing ? 'Save Changes' : 'Add Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
