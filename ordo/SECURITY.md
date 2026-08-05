# Ordo security checklist

## Secrets

Never expose these values in browser code, git, screenshots, or chat:

- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`
- `OPENAI_API_KEY`
- Supabase `service_role` key
- `ORDO_SYNC_TOKEN`

Keep them only in Render Environment variables. `NEXT_PUBLIC_*` variables are intentionally visible to browsers; only Supabase URL and publishable/anon keys belong there.

## Required production environment

```env
NEXT_PUBLIC_ORDO_AUTH=supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_ORDO_ADMIN_EMAILS=owner@example.com
ORDO_ADMIN_EMAILS=owner@example.com
ORDO_SYNC_TOKEN=a-long-random-secret
```

## Supabase

1. Run both migrations in `supabase/migrations/`.
2. Confirm RLS is enabled for `ordo_day_states` and `ordo_day_history`.
3. Test with two different accounts: one account must never be able to query another account's state/history.
4. Configure password reset redirect URLs.

## AI / AWS Bedrock

- Give the IAM identity only `bedrock:InvokeModel` for the selected model/region.
- Do not grant broad administrator permissions.
- The AI API requires an authenticated Supabase user and enforces a lightweight per-instance quota. Add a durable Redis rate limit before public scale.

## Incident response

If a secret was exposed, revoke/rotate it immediately in AWS, Supabase, or Render, then redeploy.
