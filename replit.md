# ORDO

**Take control of every day.** Plan · Focus · Close.

A local-first day-control app built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## How to run

```bash
cd ordo && npm run dev
```

The dev server starts on port 5000. The configured workflow (`Start application`) does this automatically.

## Project structure

```
ordo/          ← all app source lives here
  src/         ← Next.js App Router source
  public/      ← static assets
  preview/     ← static HTML previews (marketing/arena)
  e2e/         ← Playwright end-to-end tests
  .env.example ← optional environment variables
```

## Key routes

| Route | Purpose |
|---|---|
| `/` | Marketing landing page |
| `/app` | Today board (priorities, tasks, schedule, habits) |
| `/app/focus` | Focus timer |
| `/app/schedule` | Time blocks |
| `/app/habits` | Habits & streaks |
| `/app/review` | Day close review |
| `/app/insights` | Weekly insights |
| `/app/settings` | Profile, language, reminders, sync |
| `/login` · `/signup` | Local demo auth |

## Optional environment variables

Copy `ordo/.env.example` → `ordo/.env.local` to enable:

- **Cloud sync** — `NEXT_PUBLIC_ORDO_SYNC_URL` + `NEXT_PUBLIC_ORDO_SYNC_TOKEN`
- **Auth providers** — Clerk or Supabase (see `.env.example`)
- **Redis sync** (Upstash) — for durable multi-instance sync

Without any env vars the app runs fully local (default).

## Scripts

```bash
npm run dev       # dev server (port 5000)
npm run build     # production build
npm run lint      # ESLint
npm test          # unit tests (vitest)
npm run test:e2e  # Playwright smoke tests
npm run ci        # lint + unit + build
```

## User preferences

_None recorded yet._
