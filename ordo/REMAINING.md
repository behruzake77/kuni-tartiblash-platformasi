# Qolgan ishlar

## Kod / infra — yopilgan
- [x] Lint / unit / API E2E / build
- [x] Legal + contact email env
- [x] SEO, security headers, Docker, CI
- [x] Upstash Redis durable sync (Vercel)
- [x] Rate limit on sync API
- [x] Vitest ESM config warning fixed

## Siz deploy qilganda (5–30 min)
1. `NEXT_PUBLIC_SITE_URL=https://your.domain`
2. `NEXT_PUBLIC_CONTACT_EMAIL=you@mail.com`
3. (Vercel multi-device) Upstash Redis REST URL + token
4. (Tavsiya) `ORDO_SYNC_TOKEN=...`
5. `./scripts/smoke.sh https://your.domain`

## Faqat SaaS bo‘lsa (keyin)
| Ish | Status |
|---|---|
| Clerk/Supabase to‘liq SDK | Adapter + docs bor |
| Stripe billing | Yo‘q |
| Web Push | Yo‘q |
| Dizayner logo | SVG placeholder bor |
| Browser Playwright OS deps | Spec bor; CI da `install-deps` |

## Foiz
- Local/demo: **~99%**
- Deploy-ready: **~92%** (Upstash bilan multi-device)
- Commercial SaaS: **~70%**
