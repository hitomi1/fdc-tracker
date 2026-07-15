import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DraftEvent, Filters, SortColumn, SortState, Tab } from './types';
import { applyFilters, applySort } from './lib/events';
import { useEvents } from './lib/useEvents';
import { useToasts } from './lib/useToasts';
import { useAuth } from './lib/useAuth';
import { TopBar } from './components/TopBar';
import { AuthModal } from './components/AuthModal';
import { FiltersBar } from './components/FiltersBar';
import { EventList } from './components/EventList';
import { EventModal } from './components/EventModal';
import { ImportModal } from './components/ImportModal';
import type { ParsedEvent } from './lib/import17lands';
import { PerformanceTab } from './components/PerformanceTab';
import { RewardsTab } from './components/RewardsTab';
import { Toasts } from './components/Toasts';
import { maybeAutoStartTour, startTour } from './lib/tour';

const TABS: { id: Tab; label: string }[] = [
  { id: 'events', label: 'Event List' },
  { id: 'performance', label: 'Performance' },
  { id: 'rewards', label: 'Rewards' },
];

export default function App() {
  const auth = useAuth();
  const { events, isSample, syncing, addEvent, addEvents, updateEvent, deleteEvent, freshStart } = useEvents(auth.user);
  const { toasts, showToast } = useToasts();

  const [filters, setFilters] = useState<Filters>({ format: '', set: '', dateFrom: '', dateTo: '' });
  const [sort, setSort] = useState<SortState>({ col: 'date', dir: 'desc' });
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newId, setNewId] = useState<string | null>(null);

  // Auto-run the welcome tour the first time someone opens the app.
  useEffect(() => { maybeAutoStartTour(); }, []);

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

  const handleImport = (parsed: ParsedEvent[]) => {
    addEvents(parsed);
    setImportOpen(false);
    showToast(`Imported ${parsed.length} event${parsed.length === 1 ? '' : 's'}.`, 'success');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    deleteEvent(id);
    if (expandedId === id) setExpandedId(null);
    showToast('Event deleted.', 'success');
  };

  const handleFreshStart = useCallback(() => {
    if (!confirm('Clear the sample data and start with an empty history?')) return;
    freshStart();
    setExpandedId(null);
    showToast('Fresh start! Add your first event.', 'success');
  }, [freshStart, showToast]);

  const handleInstalled = useCallback(() => {
    showToast('App installed! You can now use it offline.', 'success');
  }, [showToast]);

  const handleSignOut = useCallback(async () => {
    await auth.signOut();
    showToast('Signed out. Your data stays on this device.', 'success');
  }, [auth, showToast]);

  return (
    <>
      <TopBar
        onNewEvent={openNewModal}
        onImport={() => setImportOpen(true)}
        onHelp={startTour}
        onInstalled={handleInstalled}
        showFreshStart={isSample}
        onFreshStart={handleFreshStart}
        authEnabled={auth.enabled}
        userEmail={auth.user?.email ?? null}
        syncing={syncing}
        onSignIn={() => setAuthOpen(true)}
        onSignOut={handleSignOut}
      />

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

      {importOpen && (
        <ImportModal existing={events} onClose={() => setImportOpen(false)} onImport={handleImport} />
      )}

      {authOpen && (
        <AuthModal
          auth={auth}
          onClose={() => setAuthOpen(false)}
          onSignedIn={() => {
            setAuthOpen(false);
            showToast('Signed in! Your history is now synced.', 'success');
          }}
        />
      )}

      <Toasts toasts={toasts} />
    </>
  );
}
