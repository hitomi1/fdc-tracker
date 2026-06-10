import type { DraftEvent, Filters } from '../types';

interface Props {
  events: DraftEvent[];
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FiltersBar({ events, filters, onChange }: Props) {
  const usedFormats = [...new Set(events.map(e => e.format))].sort();
  const usedSets = [...new Set(events.map(e => e.set))].sort();

  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <section id="filters-section" aria-label="Filter events">
      <div className="filters-row" role="group" aria-label="Event filters">
        <div className="filter-group">
          <label htmlFor="filter-set">Set</label>
          <select
            id="filter-set"
            aria-label="Filter by set"
            value={filters.set}
            onChange={e => set({ set: e.target.value })}
          >
            <option value="">All Sets</option>
            {usedSets.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-format">Format</label>
          <select
            id="filter-format"
            aria-label="Filter by format"
            value={filters.format}
            onChange={e => set({ format: e.target.value })}
          >
            <option value="">All Formats</option>
            {usedFormats.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="filter-group date-range">
          <label>Date Range</label>
          <div className="date-inputs">
            <input
              type="date"
              aria-label="Filter from date"
              value={filters.dateFrom}
              onChange={e => set({ dateFrom: e.target.value })}
            />
            <input
              type="date"
              aria-label="Filter to date"
              value={filters.dateTo}
              onChange={e => set({ dateTo: e.target.value })}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button
            className="btn btn-ghost btn-sm"
            aria-label="Clear all filters"
            onClick={() => onChange({ format: '', set: '', dateFrom: '', dateTo: '' })}
          >
            ✕ Clear
          </button>
        </div>
      </div>
    </section>
  );
}
