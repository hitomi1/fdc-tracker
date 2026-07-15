import type { DraftEvent } from '../types';
import { supabase } from './supabase';

// Read the signed-in user's stored events. Returns null when they have no row
// yet (i.e. a brand-new account), which the caller treats differently from an
// empty history.
export async function fetchRemoteEvents(): Promise<DraftEvent[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('user_events')
    .select('events')
    .maybeSingle();
  if (error) {
    console.warn('FDC: failed to load cloud events', error.message);
    return null;
  }
  if (!data) return null;
  return Array.isArray(data.events) ? (data.events as DraftEvent[]) : [];
}

// Upsert the whole history for the given user. Last write wins.
export async function saveRemoteEvents(userId: string, events: DraftEvent[]): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('user_events')
    .upsert({ user_id: userId, events, updated_at: new Date().toISOString() });
  if (error) {
    console.warn('FDC: failed to save cloud events', error.message);
    return false;
  }
  return true;
}

// Union two histories by event id. Used on first login so any local events that
// were never synced aren't lost when a cloud history already exists.
export function mergeById(remote: DraftEvent[], local: DraftEvent[]): DraftEvent[] {
  const seen = new Set(remote.map(e => e.id));
  const extras = local.filter(e => !seen.has(e.id));
  return extras.length ? [...extras, ...remote] : remote;
}
