import { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { DraftEvent } from '../types';
import { SAMPLE_EVENTS } from '../data/sampleEvents';
import { generateId } from './events';
import { fetchRemoteEvents, saveRemoteEvents, mergeById } from './remoteEvents';

const STORAGE_KEY = 'fdc_events';

// Returns the user's stored events, or null when nothing has been saved yet.
// An empty array counts as real data (the user did a fresh start).
function loadStored(): DraftEvent[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('FDC: failed to parse stored events', e);
  }
  return null;
}

function persistLocal(events: DraftEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('FDC: failed to save events', e);
  }
}

export function useEvents(user: User | null) {
  const stored = loadStored();
  // When there's nothing saved, show the sample events as a preview but mark
  // them as such so they're never persisted and a "Fresh start" can clear them.
  const [events, setEvents] = useState<DraftEvent[]>(stored ?? SAMPLE_EVENTS);
  const [isSample, setIsSample] = useState(stored === null);
  const [syncing, setSyncing] = useState(false);

  // Tracks which user id the current in-memory events belong to, so the
  // debounced save effect never pushes one account's data into another.
  const ownerRef = useRef<string | null>(null);

  // On sign-in, reconcile local and cloud history. On sign-out, fall back to
  // whatever is cached locally.
  useEffect(() => {
    if (!user) {
      ownerRef.current = null;
      return;
    }
    let cancelled = false;
    setSyncing(true);
    (async () => {
      const remote = await fetchRemoteEvents();
      if (cancelled) return;
      const local = loadStored();
      const localReal = local ?? []; // sample data is never in localStorage

      if (remote === null) {
        // Brand-new account: seed the cloud with whatever this device has.
        if (localReal.length) await saveRemoteEvents(user.id, localReal);
        applyResolved(localReal);
      } else {
        // Existing cloud history wins, but merge in any local-only events so
        // nothing added offline before signing in gets dropped.
        const merged = mergeById(remote, localReal);
        if (merged.length !== remote.length) await saveRemoteEvents(user.id, merged);
        applyResolved(merged);
      }
      if (!cancelled) setSyncing(false);
    })();

    function applyResolved(next: DraftEvent[]) {
      ownerRef.current = user!.id;
      persistLocal(next);
      setEvents(next);
      setIsSample(false);
    }

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Persist changes: always to localStorage; to the cloud (debounced) when the
  // in-memory data is confirmed to belong to the signed-in user.
  useEffect(() => {
    if (isSample) return;
    persistLocal(events);
    if (!user || ownerRef.current !== user.id) return;
    const t = setTimeout(() => {
      saveRemoteEvents(user.id, events);
    }, 800);
    return () => clearTimeout(t);
  }, [events, isSample, user]);

  const markOwned = () => {
    // A local mutation before the cloud load finishes still belongs to this
    // user; claim ownership so the change syncs up.
    if (user) ownerRef.current = user.id;
  };

  const addEvent = useCallback((data: Omit<DraftEvent, 'id'>): DraftEvent => {
    const newEv: DraftEvent = { id: generateId(), ...data };
    setEvents(prev => (isSample ? [newEv] : [newEv, ...prev]));
    setIsSample(false);
    markOwned();
    return newEv;
  }, [isSample, user]);

  // Add several events at once (e.g. from a 17Lands import). Newest first.
  const addEvents = useCallback((list: Omit<DraftEvent, 'id'>[]): DraftEvent[] => {
    const newEvs: DraftEvent[] = list.map(data => ({ id: generateId(), ...data }));
    if (!newEvs.length) return [];
    setEvents(prev => (isSample ? [...newEvs] : [...newEvs, ...prev]));
    setIsSample(false);
    markOwned();
    return newEvs;
  }, [isSample, user]);

  const updateEvent = useCallback((id: string, data: Omit<DraftEvent, 'id'>) => {
    setEvents(prev => prev.map(ev => (ev.id === id ? { ...ev, ...data } : ev)));
    setIsSample(false);
    markOwned();
  }, [user]);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
    setIsSample(false);
    markOwned();
  }, [user]);

  // Clear the sample preview and start with an empty, persisted history.
  const freshStart = useCallback(() => {
    setEvents([]);
    setIsSample(false);
    markOwned();
  }, [user]);

  return { events, isSample, syncing, addEvent, addEvents, updateEvent, deleteEvent, freshStart };
}
