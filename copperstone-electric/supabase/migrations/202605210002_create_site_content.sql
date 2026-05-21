create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.site_content (
  id text primary key default 'homepage',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint site_content_singleton check (id = 'homepage')
);

create trigger set_site_content_updated_at
before update on public.site_content
for each row
execute function public.set_updated_at();

alter table public.site_content enable row level security;

create policy "Public can read homepage content"
on public.site_content
for select
using (id = 'homepage');

create policy "Authenticated users can insert homepage content"
on public.site_content
for insert
to authenticated
with check (id = 'homepage');

create policy "Authenticated users can update homepage content"
on public.site_content
for update
to authenticated
using (id = 'homepage')
with check (id = 'homepage');

insert into public.site_content (id, content)
values ('homepage', '{}'::jsonb)
on conflict (id) do nothing;