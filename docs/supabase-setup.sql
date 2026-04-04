-- Run this in your Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Leads table
create table if not exists leads (
  id bigint generated always as identity primary key,
  school_name text not null,
  school_rbd integer,
  school_commune text,
  contact_name text not null,
  contact_role text not null,
  contact_email text not null,
  contact_phone text,
  contact_source text,
  status text not null default 'new' check (status in ('new', 'contacted', 'demo_scheduled', 'demo_done', 'closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for querying by status and date
create index if not exists idx_leads_status on leads (status);
create index if not exists idx_leads_created on leads (created_at desc);

-- Enable Row Level Security
alter table leads enable row level security;

-- Allow inserts from anonymous users (the landing page)
create policy "Allow anonymous insert" on leads
  for insert
  to anon
  with check (true);

-- Only authenticated users (your admin) can read/update
create policy "Allow authenticated read" on leads
  for select
  to authenticated
  using (true);

create policy "Allow authenticated update" on leads
  for update
  to authenticated
  using (true);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on leads
  for each row
  execute function update_updated_at();
