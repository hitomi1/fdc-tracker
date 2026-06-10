import type { DraftEvent, SortColumn, SortState } from '../types';
import { formatAbbr } from '../data/formats';
import { fmtGem, formatDate, formatDateShort, getNetGem, isTrophy, resultLabel } from '../lib/events';
import { DeckCode, EmptyState, ManaRow, ResultBadge } from './shared';

interface Props {
  events: DraftEvent[];
  totalCount: number;
  isFiltered: boolean;
  sort: SortState;
  onSort: (col: SortColumn) => void;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onNewEvent: () => void;
  newId: string | null;
}

const SORTABLE: { col: SortColumn; label: string }[] = [
  { col: 'date', label: 'Date' },
  { col: 'set', label: 'Set' },
];

function gemClass(gem: number | null): string {
  return gem === null ? '' : gem >= 0 ? 'gem-positive' : 'gem-negative';
}

function RowActions({ id, onEdit, onDelete }: { id: string; onEdit: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <>
      <button
        className="btn btn-secondary btn-sm"
        onClick={e => { e.stopPropagation(); onEdit(id); }}
      >
        ✏️ Edit
      </button>
      <button
        className="btn btn-danger btn-sm"
        onClick={e => { e.stopPropagation(); onDelete(id); }}
      >
        🗑 Delete
      </button>
    </>
  );
}

function NotesContent({ event }: { event: DraftEvent }) {
  return (
    <>
      {event.notes ? (
        <div><span className="notes-icon">📝</span> {event.notes}</div>
      ) : (
        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No notes recorded.</div>
      )}
      <DeckCode code={event.deckCode} />
    </>
  );
}

export function EventList(props: Props) {
  const {
    events, totalCount, isFiltered, sort, onSort,
    expandedId, onToggleExpand, onEdit, onDelete, onNewEvent, newId,
  } = props;

  const countText = events.length === totalCount
    ? `${totalCount} event${totalCount !== 1 ? 's' : ''}`
    : `${events.length} of ${totalCount}`;

  const sortIcon = (col: SortColumn) =>
    sort.col === col ? (sort.dir === 'asc' ? '↑' : '↓') : '↕';

  return (
    <section id="events-section" className="tab-content" aria-label="Event history">
      <div className="table-meta">
        <p className="section-title">Event History</p>
        <span className="event-count" aria-live="polite" aria-atomic="true">{countText}</span>
      </div>

      {/* ── Desktop table ─────────────────────── */}
      <div className="table-wrapper" role="region" aria-label="Events table" tabIndex={0}>
        <table aria-label="Draft event history">
          <thead>
            <tr>
              {SORTABLE.map(({ col, label }) => (
                <th
                  key={col}
                  scope="col"
                  tabIndex={0}
                  className={sort.col === col ? 'sorted' : ''}
                  onClick={() => onSort(col)}
                >
                  {label} <span className="sort-icon" aria-hidden="true">{sortIcon(col)}</span>
                </th>
              ))}
              <th className="col-trophy" scope="col" title="Trophy">★</th>
              <th scope="col">Colors</th>
              <th
                scope="col"
                tabIndex={0}
                className={sort.col === 'wins' ? 'sorted' : ''}
                onClick={() => onSort('wins')}
              >
                W/L <span className="sort-icon" aria-hidden="true">{sortIcon('wins')}</span>
              </th>
              <th
                scope="col"
                tabIndex={0}
                className={sort.col === 'format' ? 'sorted' : ''}
                onClick={() => onSort('format')}
              >
                Format <span className="sort-icon" aria-hidden="true">{sortIcon('format')}</span>
              </th>
              <th scope="col">Start Rank</th>
              <th scope="col">End Rank</th>
              <th scope="col" title="Net gems from this event">💎 Net</th>
            </tr>
          </thead>
          <tbody aria-live="polite">
            {events.map(ev => {
              const expanded = expandedId === ev.id;
              const trophy = isTrophy(ev);
              const gem = getNetGem(ev);
              return (
                <FragmentRow
                  key={ev.id}
                  ev={ev}
                  expanded={expanded}
                  trophy={trophy}
                  gem={gem}
                  isNew={newId === ev.id}
                  onToggleExpand={onToggleExpand}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Desktop empty state ────────────────── */}
      {!events.length && (
        <div id="table-empty">
          <EmptyState isFiltered={isFiltered} onNewEvent={onNewEvent} />
        </div>
      )}

      {/* ── Mobile card list ───────────────────── */}
      <div className="card-list" role="list" aria-label="Draft events" aria-live="polite">
        {!events.length && <EmptyState isFiltered={isFiltered} onNewEvent={onNewEvent} />}
        {events.map(ev => {
          const expanded = expandedId === ev.id;
          const trophy = isTrophy(ev);
          const gem = getNetGem(ev);
          return (
            <div
              key={ev.id}
              className={'event-card' + (expanded ? ' expanded' : '')}
              style={newId === ev.id ? { animation: 'rowPulse 1.4s ease forwards' } : undefined}
            >
              <div className="card-main" onClick={() => onToggleExpand(ev.id)}>
                <div className="card-top">
                  <span className="format-pill">{formatAbbr(ev.format)}</span>
                  <span className="set-tag">{ev.set}</span>
                  {trophy && <span className="trophy-star" title="Trophy">★</span>}
                  <span className="date-text">{formatDateShort(ev.date)}</span>
                </div>
                <div className="card-bottom">
                  <ResultBadge result={resultLabel(ev)} />
                  <ManaRow event={ev} size="large" />
                </div>
                {(ev.startRank || ev.endRank) && (
                  <div className="card-ranks">
                    <span className="rank-label">Rank:</span> {ev.startRank || '—'} → {ev.endRank || '—'}
                  </div>
                )}
                <div className="card-record-col">
                  <span className="card-record">{ev.wins}-{ev.losses}</span>
                  {gem !== null && <span className={`card-gem ${gemClass(gem)}`}>{fmtGem(gem)}</span>}
                  <span className="card-expand-hint">▼</span>
                </div>
              </div>
              <div className="card-notes">
                <div className="card-notes-inner">
                  <div className="notes-label">Notes</div>
                  {ev.notes
                    ? <div>{ev.notes}</div>
                    : <em style={{ color: 'var(--text-muted)' }}>No notes recorded.</em>}
                  <DeckCode code={ev.deckCode} />
                </div>
              </div>
              <div className="card-actions">
                <RowActions id={ev.id} onEdit={onEdit} onDelete={onDelete} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

interface RowProps {
  ev: DraftEvent;
  expanded: boolean;
  trophy: boolean;
  gem: number | null;
  isNew: boolean;
  onToggleExpand: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function FragmentRow({ ev, expanded, trophy, gem, isNew, onToggleExpand, onEdit, onDelete }: RowProps) {
  return (
    <>
      <tr
        className={(expanded ? 'expanded' : '') + (isNew ? ' row-new' : '')}
        onClick={() => onToggleExpand(ev.id)}
      >
        <td className="date-text">{formatDate(ev.date)}</td>
        <td><span className="set-tag">{ev.set}</span></td>
        <td className="col-trophy">
          {trophy
            ? <span className="trophy-star" title="Trophy" aria-label="Trophy">★</span>
            : <span className="trophy-star empty" aria-hidden="true">★</span>}
        </td>
        <td><ManaRow event={ev} /></td>
        <td className="record-cell">{ev.wins}-{ev.losses}</td>
        <td><span className="format-pill">{formatAbbr(ev.format)}</span></td>
        <td className="rank-cell">{ev.startRank || '—'}</td>
        <td className="rank-cell">{ev.endRank || '—'}</td>
        <td className={`gem-cell ${gemClass(gem)}`}>{fmtGem(gem)}</td>
      </tr>
      {expanded && (
        <tr className="notes-row">
          <td colSpan={9}>
            <div className="notes-content"><NotesContent event={ev} /></div>
            <div className="row-actions" style={{ marginTop: 8 }}>
              <RowActions id={ev.id} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
