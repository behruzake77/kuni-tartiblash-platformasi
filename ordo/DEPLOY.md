# Deploy Ordo

Ordo is a **Next.js 16** app (App Router). Default mode is **local-first**; optional built-in sync and future Clerk/Supabase auth.

---

## 1. Quick deploy (Vercel)

1. Push the `ordo/` repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → import the repo.
3. **Root directory:** `ordo` (if monorepo) or repo root.
4. Framework: Next.js (auto).
5. Add env vars (below) → Deploy.

```bash
# Local production check
cd ordo
npm ci
npm run build
npm run start
```

Open `http://localhost:3000`. Health: `http://localhost:3000/api/health`.

---

## 2. Environment variables

Copy `.env.example` → `.env.local` (local) or Vercel Project Settings.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Yes in prod** | Canonical URL, sitemap, OG (`https://your-domain.com`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Recommended | Privacy/Terms contact mailto |
| `ORDO_SYNC_TOKEN` | Recommended | Protects `GET/PUT /api/sync/*` |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | **Vercel multi-device** | Durable sync store (free tier OK) |
| `NEXT_PUBLIC_ORDO_SYNC_URL` | No | External sync API (overrides built-in) |
| `NEXT_PUBLIC_ORDO_SYNC_TOKEN` | No | Bearer for external/built-in client calls |
| `NEXT_PUBLIC_ORDO_AUTH` | No | `local` (default) · `clerk` · `supabase` |
| `CLERK_*` / `NEXT_PUBLIC_CLERK_*` | If Clerk | See Clerk dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | If Supabase | See Supabase dashboard |

### Built-in multi-device sync

1. Deploy the app (same URL for all devices).
2. In **Settings → Cloud sync**, set a **workspace key** (e.g. your email).
3. On the second device: open the same URL, same workspace key → **Sync now**.
4. Set `ORDO_SYNC_TOKEN` in production and send it as:
   - `Authorization: Bearer <token>`, or
   - client `NEXT_PUBLIC_ORDO_SYNC_TOKEN` (less ideal; prefer server-only token + your own BFF later).

Data files on the server: `.data/sync/` (ephemeral on some hosts — use a volume or external URL for durable multi-instance deploys).

**Vercel multi-device (recommended):** add free [Upstash Redis](https://upstash.com) REST credentials:

```bash
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxx
```

Built-in `/api/sync` then stores payloads in Redis (durable across serverless instances).  
Without Upstash on Vercel, sync falls back to **in-memory** (single instance only — not durable).  
Docker/VPS keeps using the `.data/sync/` filesystem volume.

---

## 3. Auth modes

### Local (default)

- `NEXT_PUBLIC_ORDO_AUTH=local` or unset.
- Email/password UI stores a profile in `localStorage` only (demo).
- Fine for personal use and demos.

### Clerk (production accounts)

```bash
npm install @clerk/nextjs
```

1. Create app at [clerk.com](https://clerk.com).
2. Set `NEXT_PUBLIC_ORDO_AUTH=clerk` and Clerk publishable/secret keys.
3. Wire `src/lib/auth/index.ts` clerk branch to Clerk SDK (stub throws until configured).
4. Wrap layout with `ClerkProvider`; replace `UserProvider` session reads with Clerk `useUser`.

### Supabase Auth

```bash
npm install @supabase/supabase-js @supabase/ssr
```

1. Create project → enable Email auth.
2. Set `NEXT_PUBLIC_ORDO_AUTH=supabase` + URL + anon key.
3. Implement the supabase branch in `src/lib/auth/index.ts`.

---

## 4. Security checklist

- [x] Security headers in `next.config.ts` (CSP, nosniff, frame, referrer, HSTS in prod)
- [x] `poweredByHeader: false`
- [x] `/api/health` for probes
- [ ] Set `NEXT_PUBLIC_SITE_URL` to HTTPS domain
- [ ] Set `ORDO_SYNC_TOKEN` if sync is public
- [ ] Replace demo auth before storing real user secrets
- [ ] Review CSP if you add analytics scripts

---

## 5. Post-deploy smoke test

```bash
curl -s https://YOUR_DOMAIN/api/health | jq .
curl -sI https://YOUR_DOMAIN/ | head -20   # check security headers
curl -s https://YOUR_DOMAIN/sitemap.xml | head
```

Manual:

1. `/` marketing loads  
2. `/signup` → onboarding → `/app`  
3. Add task → refresh → still there  
4. Settings → export Markdown  
5. `/privacy` · `/terms`  

Automated:

```bash
npm test
npm run test:e2e    # Playwright (see below)
```

---

## 6. Docker (optional)

```dockerfile
# Dockerfile (example)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Persist sync data
VOLUME ["/app/.data"]
EXPOSE 3000
CMD ["node", "server.js"]
```

Enable `output: "standalone"` in `next.config.ts` if you use this Dockerfile.

---

## 7. CI

GitHub Actions workflow: `.github/workflows/ci.yml`  
Runs `lint`, `test`, `build` on push/PR.

---

## Support matrix

| Host | App | Built-in file sync | Notes |
|---|---|---|---|
| Vercel | ✅ | ⚠️ ephemeral | Prefer external sync URL |
| Fly.io / Railway | ✅ | ✅ with volume | Good for `.data/` |
| Node VPS / Docker | ✅ | ✅ | Full control |
| Cloudflare Pages | ⚠️ | ❌ | Node APIs / `.data` limited |
