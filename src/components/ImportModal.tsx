import { useEffect, useMemo, useRef, useState } from 'react';
import type { DraftEvent } from '../types';
import { eventKey, parse17Lands, type ParsedEvent } from '../lib/import17lands';
import { formatAbbr } from '../data/formats';

interface Props {
  existing: DraftEvent[];
  onClose: () => void;
  onImport: (events: ParsedEvent[]) => void;
}

const PLACEHOLDER = `Paste rows copied from your 17Lands draft history, e.g.

2026-06-21 20:22	Hitomi	SOS	x	WB	4 - 1	PickTwoDraft	Diamond-4	Diamond-3`;

export function ImportModal({ existing, onClose, onImport }: Props) {
  const [text, setText] = useState('');
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    areaRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const { fresh, duplicates, errors } = useMemo(() => {
    const { events, errors } = parse17Lands(text);
    const existingKeys = new Set(existing.map(eventKey));
    const seen = new Set<string>();
    const fresh: ParsedEvent[] = [];
    let duplicates = 0;
    for (const ev of events) {
      const key = eventKey(ev);
      if (existingKeys.has(key) || seen.has(key)) {
        duplicates++;
        continue;
      }
      seen.add(key);
      fresh.push(ev);
    }
    return { fresh, duplicates, errors };
  }, [text, existing]);

  const handleImport = () => {
    if (!fresh.length) return;
    onImport(fresh);
  };

  const hasInput = text.trim().length > 0;

  return (
    <div
      id="modal-overlay"
      className="visible"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-title"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <div className="modal-handle" aria-hidden="true" />

        <div className="modal-header">
          <h2 id="import-title">Import from 17Lands</h2>
          <button className="btn btn-icon btn-ghost" aria-label="Close dialog" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 0 }}>
            On 17Lands, select the rows in your draft history table and copy them, then
            paste below. Colors use 17Lands' convention — uppercase letters are main
            colors, lowercase are splashes (e.g. <code>URbg</code>).
          </p>

          <textarea
            ref={areaRef}
            aria-label="Pasted 17Lands rows"
            placeholder={PLACEHOLDER}
            rows={10}
            style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
            value={text}
            onChange={e => setText(e.target.value)}
          />

          {hasInput && (
            <div className="import-summary" aria-live="polite" style={{ marginTop: 12, fontSize: '0.85rem' }}>
              <p style={{ margin: '0 0 8px' }}>
                <strong>{fresh.length}</strong> new event{fresh.length === 1 ? '' : 's'} to import
                {duplicates > 0 && <> · <span style={{ color: 'var(--text-muted)' }}>{duplicates} duplicate{duplicates === 1 ? '' : 's'} skipped</span></>}
                {errors.length > 0 && <> · <span style={{ color: 'var(--danger, #e25)' }}>{errors.length} unparseable</span></>}
              </p>

              {fresh.length > 0 && (
                <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid var(--border, #333)', borderRadius: 6 }}>
                  <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                    <tbody>
                      {fresh.map((ev, i) => {
                        const colors = [...(ev.mainColors ?? []), ...(ev.splashColors ?? [])].join('') || '—';
                        return (
                          <tr key={i} style={{ borderTop: i ? '1px solid var(--border, #333)' : 'none' }}>
                            <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{ev.date.replace('T', ' ')}</td>
                            <td style={{ padding: '4px 8px' }}>{ev.set}</td>
                            <td style={{ padding: '4px 8px' }}>{formatAbbr(ev.format)}</td>
                            <td style={{ padding: '4px 8px' }}>{colors}</td>
                            <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{ev.wins}–{ev.losses}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {errors.length > 0 && (
                <details style={{ marginTop: 8 }}>
                  <summary style={{ cursor: 'pointer', color: 'var(--text-accent)' }}>
                    Show {errors.length} skipped row{errors.length === 1 ? '' : 's'}
                  </summary>
                  <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: 'var(--text-muted)' }}>
                    {errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </details>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" type="button" disabled={!fresh.length} onClick={handleImport}>
            Import {fresh.length || ''} Event{fresh.length === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    </div>
  );
}
