import { useCallback, useMemo, useState } from 'react';
import type { DraftEvent, Filters, SortColumn, SortState, Tab } from './types';
import { applyFilters, applySort } from './lib/events';
import { useEvents } from './lib/useEvents';
import { useToasts } from './lib/useToasts';
import { TopBar } from './components/TopBar';
import { FiltersBar } from './components/FiltersBar';
import { EventList } from './components/EventList';
import { EventModal } from './components/EventModal';
import { PerformanceTab } from './components/PerformanceTab';
import { RewardsTab } from './components/RewardsTab';
import { Toasts } from './components/Toasts';

const TABS: { id: Tab; label: string }[] = [
  { id: 'events', label: 'Event List' },
  { id: 'performance', label: 'Performance' },
  { id: 'rewards', label: 'Rewards' },
];

export default function App() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { toasts, showToast } = useToasts();

  const [filters, setFilters] = useState<Filters>({ format: '', set: '', dateFrom: '', dateTo: '' });
  const [sort, setSort] = useState<SortState>({ col: 'date', dir: 'desc' });
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newId, setNewId] = useState<string | null>(null);

  const filtered = useMemo(() => applyFilters(events, filters), [events, filters]);
  const filteredSorted = useMemo(() => applySort(filtered, sort), [filtered, sort]);
  const isFiltered = !!(filters.format || filters.set || filters.dateFrom || filters.dateTo);

  const editing = editingId ? events.find(e => e.id === editingId) ?? null : null;

  const handleFilters = (f: Filters) => {
    setFilters(f);
    setExpandedId(null);
  };

  const handleSort = (col: SortColumn) => {
    setSort(prev =>
      prev.col === col
        ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { col, dir: col === 'date' ? 'desc' : 'asc' },
    );
  };

  const openNewModal = useCallback(() => {
    setEditingId(null);
    setModalOpen(true);
  }, []);

  const openEditModal = (id: string) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
  }, []);

  const handleSave = (data: Omit<DraftEvent, 'id'>) => {
    if (editingId) {
      updateEvent(editingId, data);
      showToast('Event updated.', 'success');
    } else {
      const newEv = addEvent(data);
      setNewId(newEv.id);
      setTimeout(() => setNewId(null), 1500);
      showToast('Event added!', 'success');
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    deleteEvent(id);
    if (expandedId === id) setExpandedId(null);
    showToast('Event deleted.', 'success');
  };

  const handleInstalled = useCallback(() => {
    showToast('App installed! You can now use it offline.', 'success');
  }, [showToast]);

  return (
    <>
      <TopBar onNewEvent={openNewModal} onInstalled={handleInstalled} />

      <main id="app" role="main">
        <FiltersBar events={events} filters={filters} onChange={handleFilters} />

        <div className="tab-bar" role="tablist" aria-label="View tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={'tab-btn' + (activeTab === tab.id ? ' active' : '')}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'events' && (
          <EventList
            events={filteredSorted}
            totalCount={events.length}
            isFiltered={isFiltered}
            sort={sort}
            onSort={handleSort}
            expandedId={expandedId}
            onToggleExpand={id => setExpandedId(prev => (prev === id ? null : id))}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onNewEvent={openNewModal}
            newId={newId}
          />
        )}

        {activeTab === 'performance' && <PerformanceTab events={filtered} />}

        {activeTab === 'rewards' && <RewardsTab />}
      </main>

      {modalOpen && (
        <EventModal key={editingId ?? 'new'} editing={editing} onClose={closeModal} onSave={handleSave} />
      )}

      <Toasts toasts={toasts} />
    </>
  );
}
