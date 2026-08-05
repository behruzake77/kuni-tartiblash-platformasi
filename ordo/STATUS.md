# ORDO — 0.9.2

**Local/demo:** ~99% · **Deploy:** ~92% · **SaaS:** ~70%

## Gates
- lint ✅ · unit 20+ · API e2e 7 ✅ · build ✅

## Shu turda yopildi
- **Theme Engine v2** — har bir mavzu butun dizaynni qayta bezaydi:
  to‘liq rang palitrasi (dark+light), animatsion fon sahnalari (qor, yulduzlar, pufakchalar, gul barglari, halftone, piksel panjara), karta uslublari (shisha, neon, pop-art, piksel), shrift/radius shaxsiyati, View-Transition silliq almashtirish, FOUC himoyasi
- Upstash Redis durable sync
- Contact email env (Privacy/Terms)
- Sync rate limit
- Vitest ESM config
- Site URL helpers

## Deploy tez yo‘l
```bash
# Vercel env:
NEXT_PUBLIC_SITE_URL=https://...
NEXT_PUBLIC_CONTACT_EMAIL=you@...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
ORDO_SYNC_TOKEN=...
```

See **DEPLOY.md** · backlog **REMAINING.md**
