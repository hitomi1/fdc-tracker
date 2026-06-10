import type { DraftEvent } from '../types';
import { COLOR_NAMES } from '../data/formats';
import { mainColorsOf, splashColorsOf, type ResultKind } from '../lib/events';

export function ManaRow({ event, size }: { event: DraftEvent; size?: 'large' }) {
  const main = mainColorsOf(event);
  const splash = splashColorsOf(event);
  if (!main.length && !splash.length) {
    return <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>;
  }
  const base = size === 'large' ? 'mana-pip large' : 'mana-pip';
  return (
    <span className="mana-row">
      {main.map(c => (
        <span key={c} className={`${base} ${c}`} title={COLOR_NAMES[c] ?? c} />
      ))}
      {splash.map(c => (
        <span key={`s-${c}`} className={`${base} ${c} splash`} title={`${COLOR_NAMES[c] ?? c} (splash)`} />
      ))}
    </span>
  );
}

export function ResultBadge({ result }: { result: ResultKind }) {
  if (result === 'trophy') return <span className="badge badge-trophy">🏆 Trophy</span>;
  if (result === 'win') return <span className="badge badge-win">✓ Win</span>;
  return <span className="badge badge-loss">✗ Loss</span>;
}

export function DeckCode({ code }: { code?: string }) {
  if (!code) return null;
  return (
    <details style={{ marginTop: 8 }}>
      <summary style={{ cursor: 'pointer', color: 'var(--text-accent)', fontSize: '0.8rem' }}>
        Show deck code
      </summary>
      <pre className="deck-code-block">{code}</pre>
    </details>
  );
}

export function EmptyState({ isFiltered, onNewEvent }: { isFiltered: boolean; onNewEvent: () => void }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">🃏</div>
      <h3>{isFiltered ? 'No events match your filters.' : 'No events yet. Add your first draft!'}</h3>
      <p>{isFiltered ? 'Try adjusting the filters above.' : 'Tap "New Event" to log a result.'}</p>
      {!isFiltered && (
        <button className="btn btn-primary" onClick={onNewEvent}>+ New Event</button>
      )}
    </div>
  );
}
