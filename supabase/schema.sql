-- ============================================================================
-- Pro Tech Collision — database schema
--
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: everything is IF NOT EXISTS / OR REPLACE guarded.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Owner allowlist
--
-- Controls who can write. Only emails in this table get admin access, so
-- signups alone grant nothing. Add the owner's email after they sign up.
-- ----------------------------------------------------------------------------
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Signed-in users may check their own admin row (needed for the UI gate).
drop policy if exists "admins can read own row" on public.admins;
create policy "admins can read own row"
  on public.admins for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- Helper used by every write policy below.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- ----------------------------------------------------------------------------
-- Gallery: before/after repair showcases
-- ----------------------------------------------------------------------------
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  vehicle text,                       -- e.g. "2021 Ford F-150"
  before_path text not null,          -- storage path within the bucket
  after_path text not null,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_items_published_idx
  on public.gallery_items (published, sort_order desc, created_at desc);

alter table public.gallery_items enable row level security;

-- Anyone (signed out included) can read published items.
drop policy if exists "public reads published gallery" on public.gallery_items;
create policy "public reads published gallery"
  on public.gallery_items for select
  to anon, authenticated
  using (published = true);

-- Admins can read everything, including unpublished drafts.
drop policy if exists "admins read all gallery" on public.gallery_items;
create policy "admins read all gallery"
  on public.gallery_items for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins insert gallery" on public.gallery_items;
create policy "admins insert gallery"
  on public.gallery_items for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins update gallery" on public.gallery_items;
create policy "admins update gallery"
  on public.gallery_items for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete gallery" on public.gallery_items;
create policy "admins delete gallery"
  on public.gallery_items for delete
  to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- Testimonials
--
-- Populated by the owner from real reviews. Google's terms don't permit
-- scraping their reviews, so these are entered by hand, attributed, and
-- the live Google listing is linked from the site.
-- ----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  quote text not null,
  rating smallint check (rating between 1 and 5),
  source text default 'Google',       -- where the review came from
  source_url text,
  reviewed_on date,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists testimonials_published_idx
  on public.testimonials (published, sort_order desc, created_at desc);

alter table public.testimonials enable row level security;

drop policy if exists "public reads published testimonials" on public.testimonials;
create policy "public reads published testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (published = true);

drop policy if exists "admins read all testimonials" on public.testimonials;
create policy "admins read all testimonials"
  on public.testimonials for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins insert testimonials" on public.testimonials;
create policy "admins insert testimonials"
  on public.testimonials for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins update testimonials" on public.testimonials;
create policy "admins update testimonials"
  on public.testimonials for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete testimonials" on public.testimonials;
create policy "admins delete testimonials"
  on public.testimonials for delete
  to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- Quote requests from the public contact form
-- ----------------------------------------------------------------------------
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  vehicle text,
  message text,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists quote_requests_created_idx
  on public.quote_requests (handled, created_at desc);

alter table public.quote_requests enable row level security;

-- Anonymous visitors may submit, but may NOT read anything back.
-- Without this asymmetry the form would leak every customer's contact info.
drop policy if exists "anyone can submit a quote request" on public.quote_requests;
create policy "anyone can submit a quote request"
  on public.quote_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins read quote requests" on public.quote_requests;
create policy "admins read quote requests"
  on public.quote_requests for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update quote requests" on public.quote_requests;
create policy "admins update quote requests"
  on public.quote_requests for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete quote requests" on public.quote_requests;
create policy "admins delete quote requests"
  on public.quote_requests for delete
  to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- Storage bucket for gallery photos
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Public read (the bucket serves the website's images).
drop policy if exists "public reads gallery bucket" on storage.objects;
create policy "public reads gallery bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery');

-- Only admins may upload, replace, or remove photos.
drop policy if exists "admins upload to gallery bucket" on storage.objects;
create policy "admins upload to gallery bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "admins update gallery bucket" on storage.objects;
create policy "admins update gallery bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery' and public.is_admin())
  with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "admins delete from gallery bucket" on storage.objects;
create policy "admins delete from gallery bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery' and public.is_admin());

-- ----------------------------------------------------------------------------
-- Keep updated_at fresh on gallery edits
-- ----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gallery_items_touch_updated_at on public.gallery_items;
create trigger gallery_items_touch_updated_at
  before update on public.gallery_items
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- FINAL STEP — grant the owner admin access.
-- Have them sign up through /admin/login first, then run:
--
--   insert into public.admins (email) values ('owner@example.com');
--
-- ============================================================================
