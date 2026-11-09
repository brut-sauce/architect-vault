-- Architect Vault: modules
-- Notes for Learn sections (System Design Fundamentals, Interview Patterns,
-- Machine Coding Fundamentals, Concurrency) and the HLD / LLD Cookbooks.
-- Run once in Supabase: SQL Editor -> paste -> Run.

create table if not exists public.modules (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  section      text not null check (section ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  slug         text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title        text not null check (char_length(title) between 1 and 200),
  summary      text not null default '',
  area         text not null default '',
  body_md      text not null default '',
  tags         text[] not null default '{}',
  est_minutes  int not null default 0 check (est_minutes between 0 and 600),
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, section, slug)
);

create index if not exists modules_user_section_idx
  on public.modules (user_id, section, sort_order, title);

alter table public.modules enable row level security;

drop policy if exists "modules: owner reads" on public.modules;
create policy "modules: owner reads"
  on public.modules for select using (user_id = auth.uid());

drop policy if exists "modules: owner inserts" on public.modules;
create policy "modules: owner inserts"
  on public.modules for insert with check (user_id = auth.uid());

drop policy if exists "modules: owner updates" on public.modules;
create policy "modules: owner updates"
  on public.modules for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "modules: owner deletes" on public.modules;
create policy "modules: owner deletes"
  on public.modules for delete using (user_id = auth.uid());

-- touch_updated_at() was created in 0002; recreate in case 0002 was skipped.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists modules_touch on public.modules;
create trigger modules_touch
  before update on public.modules
  for each row execute function public.touch_updated_at();
