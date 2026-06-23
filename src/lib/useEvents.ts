import { useCallback, useEffect, useState } from 'react';
import type { DraftEvent } from '../types';
import { SAMPLE_EVENTS } from '../data/sampleEvents';
import { generateId } from './events';

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

export function useEvents() {
  const stored = loadStored();
  // When there's nothing saved, show the sample events as a preview but mark
  // them as such so they're never persisted and a "Fresh start" can clear them.
  const [events, setEvents] = useState<DraftEvent[]>(stored ?? SAMPLE_EVENTS);
  const [isSample, setIsSample] = useState(stored === null);

  useEffect(() => {
    if (isSample) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn('FDC: failed to save events', e);
    }
  }, [events, isSample]);

  const addEvent = useCallback((data: Omit<DraftEvent, 'id'>): DraftEvent => {
    const newEv: DraftEvent = { id: generateId(), ...data };
    setEvents(prev => (isSample ? [newEv] : [newEv, ...prev]));
    setIsSample(false);
    return newEv;
  }, [isSample]);

  // Add several events at once (e.g. from a 17Lands import). Newest first.
  const addEvents = useCallback((list: Omit<DraftEvent, 'id'>[]): DraftEvent[] => {
    const newEvs: DraftEvent[] = list.map(data => ({ id: generateId(), ...data }));
    if (!newEvs.length) return [];
    setEvents(prev => (isSample ? [...newEvs] : [...newEvs, ...prev]));
    setIsSample(false);
    return newEvs;
  }, [isSample]);

  const updateEvent = useCallback((id: string, data: Omit<DraftEvent, 'id'>) => {
    setEvents(prev => prev.map(ev => (ev.id === id ? { ...ev, ...data } : ev)));
    setIsSample(false);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
    setIsSample(false);
  }, []);

  // Clear the sample preview and start with an empty, persisted history.
  const freshStart = useCallback(() => {
    setEvents([]);
    setIsSample(false);
  }, []);

  return { events, isSample, addEvent, addEvents, updateEvent, deleteEvent, freshStart };
}
