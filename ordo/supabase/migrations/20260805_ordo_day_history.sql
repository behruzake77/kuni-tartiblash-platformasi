-- ORDO calendar/history: preserves one complete daily snapshot per user and date.
-- Run after 20260804_ordo_day_states.sql in Supabase SQL Editor.

create table if not exists public.ordo_day_history (
  user_id uuid not null references auth.users(id) on delete cascade,
  day_date date not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (user_id, day_date)
);

alter table public.ordo_day_history enable row level security;

drop policy if exists "Users read own Ordo history" on public.ordo_day_history;
create policy "Users read own Ordo history"
  on public.ordo_day_history for select
  using ((select auth.uid()) = user_id);

drop policy if exists "Users insert own Ordo history" on public.ordo_day_history;
create policy "Users insert own Ordo history"
  on public.ordo_day_history for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users update own Ordo history" on public.ordo_day_history;
create policy "Users update own Ordo history"
  on public.ordo_day_history for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index if not exists ordo_day_history_user_date_idx
  on public.ordo_day_history (user_id, day_date desc);
