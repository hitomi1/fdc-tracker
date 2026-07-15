-- FDC Tracker — Supabase schema
-- Run this in the Supabase dashboard: SQL Editor → New query → paste → Run.
--
-- Storage model: one row per user holding their whole event history as a JSON
-- blob. This mirrors the app's existing localStorage model (a single
-- DraftEvent[] array), so the frontend barely changed. Row-level security makes
-- sure each user can only ever touch their own row.

create table if not exists public.user_events (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  events     jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_events enable row level security;

-- Each policy is scoped to the currently authenticated user's own row.
drop policy if exists "read own events"   on public.user_events;
drop policy if exists "insert own events" on public.user_events;
drop policy if exists "update own events" on public.user_events;

create policy "read own events"
  on public.user_events for select
  using (auth.uid() = user_id);

create policy "insert own events"
  on public.user_events for insert
  with check (auth.uid() = user_id);

create policy "update own events"
  on public.user_events for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
