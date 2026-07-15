import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// The anon key is a *publishable* key — it's safe to ship in the frontend bundle.
// Actual data access is protected by row-level security policies in Supabase
// (see supabase/schema.sql), which only ever let a user read/write their own row.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// When the env vars aren't set (e.g. a fork without a Supabase project), the app
// keeps working exactly as before — pure localStorage, no login. Auth UI is hidden.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
