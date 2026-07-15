import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

// Where OAuth / email-confirmation links should return to. On GitHub Pages the
// app lives under a base path (e.g. /fdc-tracker/), so honour BASE_URL.
const redirectTo = window.location.origin + import.meta.env.BASE_URL;

export interface AuthState {
  /** true until the initial session lookup resolves */
  loading: boolean;
  user: User | null;
  enabled: boolean;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithPassword: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return {
    loading,
    user: session?.user ?? null,
    enabled: isSupabaseConfigured,

    async signInWithGoogle() {
      if (!supabase) return { error: 'Login is not configured.' };
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      return { error: error?.message ?? null };
    },

    async signInWithPassword(email, password) {
      if (!supabase) return { error: 'Login is not configured.' };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },

    async signUpWithPassword(email, password) {
      if (!supabase) return { error: 'Login is not configured.', needsConfirmation: false };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      });
      // When email confirmation is on, signUp returns a user but no session.
      const needsConfirmation = !error && !data.session;
      return { error: error?.message ?? null, needsConfirmation };
    },

    async signOut() {
      await supabase?.auth.signOut();
    },
  };
}
