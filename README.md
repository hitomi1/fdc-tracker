# Fora da Caixa — Event Tracker

Offline MTG Arena draft event tracker for the Fora da Caixa community, rebuilt with **React + TypeScript + Vite**.

Log your Premier, Traditional, Quick, and Sealed results — no server, no account. Everything is stored locally in your browser (`localStorage`) and the app works fully offline as an installable PWA.

## Features

- **Event history** — log date, format, set, record, deck colors (main/splash), rank change, notes, and Arena deck export per event
- **Filters & sorting** — filter by set, format, and date range; sort by any column
- **Performance tab** — overall games/match record, trophies, net gems, and a rolling win-rate chart (last 10 / last 50 / all events)
- **Rewards reference** — full reward tables per format with standardized gem values and net return per record
- **PWA / offline** — installable on mobile and desktop, works with no connection
- **Responsive** — table view on desktop, card list on mobile

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build (dist/)
npm run preview  # preview the production build
```

## Project structure

```
src/
  data/        # static data: sets, formats, rewards tables, sample events
  lib/         # pure logic: stats, filters, rewards lookup, hooks
  components/  # React components (event list, modal, performance, rewards)
  App.tsx      # app shell, state, and tab routing
```

## Updating data

- **New MTG set released?** Add it to `src/data/sets.ts`.
- **Reward payouts changed?** Edit `src/data/rewards.ts`.
- **New event format?** Add it to `src/data/formats.ts` (formats, trophy wins, max wins/losses).
