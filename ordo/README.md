# ORDO

**Take control of every day.**  
> Plan · Focus · Close

Local-first day-control app with optional cloud sync.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript  
- Tailwind CSS v4 · design tokens · dark-first  
- Geist + Inter + JetBrains Mono · Lucide  

## Features

- **Today board** — priorities, tasks, schedule, habits  
- **Focus timer** — logs time to Today  
- **Habits + streaks**  
- **Day close review** — carries tomorrow P1  
- **⌘K command palette**  
- **Reminders** — browser + in-app  
- **i18n** — EN / UZ / RU (app + marketing)
- **PWA** — installable, offline shell
- **Theme Engine v2** — 10 ta to‘liq dizayn mavzusi: har biri ranglar,
  animatsion fon sahnasi (qor / yulduzlar / pufakchalar / barglar / piksel…),
  karta uslubi (shisha / neon / pop-art), shrift va radiusni o‘zgartiradi
- **Activity feed** + **notification inbox**  
- **Multi-tab sync** (same browser)  
- **Optional HTTP cloud sync** (`NEXT_PUBLIC_ORDO_SYNC_URL`)  

## Quick start

```bash
cd ordo
npm install
npm run dev
```

Production checklist & cloud auth: see **[DEPLOY.md](./DEPLOY.md)**.

Open [http://localhost:3000](http://localhost:3000).

| Route | Purpose |
|---|---|
| `/` | Marketing |
| `/app` | Today |
| `/app/focus` | Focus timer |
| `/app/schedule` | Time blocks (drag reorder) |
| `/app/habits` | Habits |
| `/app/review` | Day close |
| `/app/insights` | Weekly insights |
| `/app/activity` | Activity history |
| `/app/settings` | Profile, language, reminders, sync |
| `/login` · `/signup` | Local demo auth |

## Optional cloud sync

Copy `.env.example` → `.env.local`:

```bash
NEXT_PUBLIC_ORDO_SYNC_URL=https://your-api.example.com/ordo
NEXT_PUBLIC_ORDO_SYNC_TOKEN=optional-bearer
```

API contract: `src/lib/sync/mock-server.md`.

Without these vars, Ordo stays **local-only** (default).

## Keyboard

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Command palette |
| `g` then `t/s/f/h/r/i/a` | Navigate |
| `n` | New task |

## Preview (static)

Arena-friendly HTML: `preview/index.html` (includes Three.js hero).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test              # unit (vitest)
npm run test:e2e      # playwright smoke
npm run ci            # lint + unit + build
```

## License

Private — All rights reserved.
