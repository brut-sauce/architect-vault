-- Architect Vault: initial schema
-- Run once in Supabase: Dashboard -> SQL Editor -> paste -> Run.

-- 1. Profiles: one row per signed-in user ---------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
  on public.profiles for select
  using (id = auth.uid());

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Create the profile automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Health check used by /api/health -------------------------------------
create or replace function public.health()
returns timestamptz
language sql
stable
as $$ select now(); $$;

grant execute on function public.health() to anon, authenticated;
