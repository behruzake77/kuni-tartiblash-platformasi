# ORDO — 0.9.2

**Local/demo:** ~99% · **Deploy:** ~92% · **SaaS:** ~70%

## Gates
- lint ✅ · unit 20+ · API e2e 7 ✅ · build ✅

## Shu turda yopildi
- **Winter Aurora premium tema** — dashboard butunlay qayta bezaldi:
  - Kino uslubidagi tungi osmon (#061220→#0D1F3C), animatsion Aurora Borealis
  - Doimiy qor yog‘ishi, tog‘ + qarag‘ay siluetlari (pastki qism), sichqoncha parallaksi
  - Frosted-glass sidebar (20px blur), aktiv elementda ko‘k glow, muz kristall ikonkasi
  - Glassmorphism kartalar (20px burchak), ko‘k ambient glow, yuqori yorug‘lik aksi
  - Stat kartalar: yonayotgan aylana ikonkalar + animatsion to‘lqin
  - Tugmalar: #5DBDFF→#8B7DFF gradient, aurora glow, muz yaltirashi, bosishda qor uchqunlari
  - Icy shimmer progress barlar; fokus taymerda muzdek halqa + aylanuvchi muz + tugaganda qor portlashi
  - Taqvimda qorli manzara va ko‘k tanlangan kunlar; odatlar — yonayotgan muz kristallari
  - Kun yakuni kartasida qor shari (yonayotgan qarag‘ay + ichki qor) va aurora gradienti
  - Winter — endi standart (default) tema
- **Theme Engine v2** — har bir mavzu butun dizaynni qayta bezaydi
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
