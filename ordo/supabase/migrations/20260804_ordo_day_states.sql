-- ORDO: one encrypted-in-transit JSON workspace per authenticated user.
-- Run this in Supabase Dashboard → SQL Editor before enabling production sync.

create table if not exists public.ordo_day_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.ordo_day_states enable row level security;

-- Policies are idempotent for a fresh project. If re-running, drop old policies first.
drop policy if exists "Users read own Ordo state" on public.ordo_day_states;
create policy "Users read own Ordo state"
  on public.ordo_day_states for select
  using ((select auth.uid()) = user_id);

drop policy if exists "Users insert own Ordo state" on public.ordo_day_states;
create policy "Users insert own Ordo state"
  on public.ordo_day_states for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users update own Ordo state" on public.ordo_day_states;
create policy "Users update own Ordo state"
  on public.ordo_day_states for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- No delete policy by default: account data cannot be erased accidentally from the client.
create index if not exists ordo_day_states_updated_at_idx
  on public.ordo_day_states (updated_at desc);
