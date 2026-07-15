# Cross-device login setup (Supabase)

The app works with no login (localStorage only) until you configure Supabase.
These are the one-time steps to turn on accounts + cross-device sync.

## 1. Create the Supabase project
1. Go to https://supabase.com → create a free project.
2. In **Project Settings → API**, copy the **Project URL** and the **anon
   public** key.

## 2. Point the app at your project
1. Copy `.env.example` to `.env.local` in the repo root.
2. Fill in:
   ```
   VITE_SUPABASE_URL=https://YOUR-REF.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
   `.env.local` is gitignored (matched by `*.local`), so keys stay out of git.
   The anon key is a *publishable* key — safe to ship in the frontend. Data is
   protected by row-level security, not by hiding the key.

## 3. Create the table + security policies
In the Supabase dashboard: **SQL Editor → New query**, paste the contents of
`supabase/schema.sql`, and **Run**.

## 4. Enable sign-in methods
In **Authentication → Providers**:
- **Email**: enable it. Keep "Confirm email" on (users get a confirmation link).
- **Google**: enable it, then create an OAuth client in the
  [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
  - Authorized redirect URI:
    `https://YOUR-REF.supabase.co/auth/v1/callback`
  - Paste the Google **Client ID** and **Client secret** into Supabase.

## 5. Set the redirect/allowed URLs
In **Authentication → URL Configuration**:
- **Site URL**: your deployed app URL, e.g.
  `https://YOUR-USER.github.io/fdc-tracker/`
- **Redirect URLs** (add both dev and prod):
  - `http://localhost:5173/fdc-tracker/`
  - `https://YOUR-USER.github.io/fdc-tracker/`

  These must match `window.location.origin + BASE_URL` (BASE_URL is
  `/fdc-tracker/`, from `vite.config.ts`), which is where the app sends users
  back after Google login / email confirmation.

## 6. Run it
- Dev: `npm run dev` — a **Sign in** button appears in the top bar.
- Deploy: `npm run deploy` (env vars from `.env.local` are baked into the build).

## How sync works
- Storage is one row per user in `user_events`, holding the whole `DraftEvent[]`
  history as JSON — the same shape the app already kept in localStorage.
- localStorage stays as the offline cache, so the PWA still works offline.
- On sign-in: if the account has no cloud history yet, this device's local
  events are uploaded. If cloud history exists, it wins, but any local-only
  events (added offline before signing in) are merged in so nothing is lost.
- On change: writes go to localStorage immediately and to the cloud after a
  short debounce. Conflict handling is last-write-wins across devices.
