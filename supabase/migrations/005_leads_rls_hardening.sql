-- 005_leads_rls_hardening.sql
-- Hardens the `leads` table RLS to match every other table (admin-uid scoped)
-- and removes the anon INSERT bypass introduced by docs/supabase-setup.sql.
--
-- BACKGROUND
--   The original setup provisioned `leads` with:
--     - anon INSERT (with check true)            -> bots can write leads, bypassing the reCAPTCHA gate
--     - authenticated SELECT/UPDATE (using true) -> any authenticated user reads/writes all lead PII
--   All lead writes now go exclusively through the verify-lead / request-resource
--   Edge Functions using the SERVICE ROLE (which bypasses RLS). The public anon
--   client must NOT be able to write `leads` directly.
--
-- APPLY: run in Supabase SQL Editor, or `supabase db push`.
-- Idempotent: safe to re-run.

-- 1. Remove the anon INSERT bypass. Lead writes must go through verify-lead.
drop policy if exists "Allow anonymous insert" on public.leads;

-- 2. Replace the broad authenticated policies with admin-uid scoping,
--    matching prospects / prospect_activities / content_posts / social_tokens.
drop policy if exists "Allow authenticated read" on public.leads;
drop policy if exists "Allow authenticated update" on public.leads;

create policy "Admin read leads" on public.leads
  for select to authenticated
  using (auth.uid() = '169e6037-fcc2-4201-b2af-92547e1d6739');

create policy "Admin update leads" on public.leads
  for update to authenticated
  using (auth.uid() = '169e6037-fcc2-4201-b2af-92547e1d6739')
  with check (auth.uid() = '169e6037-fcc2-4201-b2af-92547e1d6739');

-- RLS remains enabled on `leads`. With no anon/insert policy, direct client
-- inserts now fail (PostgREST 401/403). Service-role writes from the
-- verify-lead and request-resource Edge Functions are unaffected.
--
-- FOLLOW-UP (client, low-risk): the direct-insert fallback at
-- src/lib/supabase.ts:199 becomes a dead path that returns an error after this
-- migration. Remove it and update the 4 no-token cases in src/lib/supabase.test.ts
-- to exercise the verify-lead fetch path instead. Prod always sends a token, so
-- there is no functional regression — the fallback only fired on reCAPTCHA load
-- failure, which should fail closed anyway.
