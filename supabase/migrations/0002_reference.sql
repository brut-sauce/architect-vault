-- Architect Vault: Quick Reference items
-- (cheat sheets now; visuals, X vs Y and anti-patterns reuse the same table)
-- Run once in Supabase: SQL Editor -> paste -> Run.

create table if not exists public.reference_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind        text not null check (kind in ('cheat', 'visual', 'vs', 'anti')),
  slug        text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title       text not null check (char_length(title) between 1 and 200),
  summary     text not null default '',
  body_md     text not null default '',
  tags        text[] not null default '{}',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, kind, slug)
);

create index if not exists reference_items_user_kind_idx
  on public.reference_items (user_id, kind, sort_order, title);

alter table public.reference_items enable row level security;

drop policy if exists "reference: owner reads" on public.reference_items;
create policy "reference: owner reads"
  on public.reference_items for select
  using (user_id = auth.uid());

drop policy if exists "reference: owner inserts" on public.reference_items;
create policy "reference: owner inserts"
  on public.reference_items for insert
  with check (user_id = auth.uid());

drop policy if exists "reference: owner updates" on public.reference_items;
create policy "reference: owner updates"
  on public.reference_items for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "reference: owner deletes" on public.reference_items;
create policy "reference: owner deletes"
  on public.reference_items for delete
  using (user_id = auth.uid());

-- Keep updated_at current on every edit.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reference_items_touch on public.reference_items;
create trigger reference_items_touch
  before update on public.reference_items
  for each row execute function public.touch_updated_at();
