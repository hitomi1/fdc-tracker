import { useCallback, useEffect, useState } from 'react';
import type { DraftEvent } from '../types';
import { SAMPLE_EVENTS } from '../data/sampleEvents';
import { generateId } from './events';

const STORAGE_KEY = 'fdc_events';

function loadEvents(): DraftEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('FDC: failed to parse stored events', e);
  }
  return SAMPLE_EVENTS;
}

export function useEvents() {
  const [events, setEvents] = useState<DraftEvent[]>(loadEvents);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn('FDC: failed to save events', e);
    }
  }, [events]);

  const addEvent = useCallback((data: Omit<DraftEvent, 'id'>): DraftEvent => {
    const newEv: DraftEvent = { id: generateId(), ...data };
    setEvents(prev => [newEv, ...prev]);
    return newEv;
  }, []);

  const updateEvent = useCallback((id: string, data: Omit<DraftEvent, 'id'>) => {
    setEvents(prev => prev.map(ev => (ev.id === id ? { ...ev, ...data } : ev)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  }, []);

  return { events, addEvent, updateEvent, deleteEvent };
}
