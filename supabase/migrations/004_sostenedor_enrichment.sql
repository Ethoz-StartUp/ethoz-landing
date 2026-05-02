-- Ethoz Admin: Sostenedor enrichment tables (F1)
-- Stores discovered URLs and enriched contact data for the 7,885 MINEDUC sostenedores.
-- Paste this in Supabase Dashboard → SQL Editor → Run

-- ── Discovered URLs (one row per candidate URL per sostenedor) ──
CREATE TABLE IF NOT EXISTS sostenedor_urls (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sostenedor_name text NOT NULL,
  sostenedor_rut text,
  url text NOT NULL,
  domain text,
  source text NOT NULL CHECK (source IN ('google', 'bing', 'duckduckgo', 'wayback', 'pattern', 'transparencia', 'chilecompra', 'manual')),
  confidence numeric(3,2) DEFAULT 0.50 CHECK (confidence BETWEEN 0 AND 1),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'scraped', 'failed', 'skipped')),
  last_scraped_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (sostenedor_name, url)
);

-- ── Enriched contact data (one row per (sostenedor, channel) tuple) ──
CREATE TABLE IF NOT EXISTS sostenedor_contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sostenedor_name text NOT NULL,
  sostenedor_rut text,

  -- Contact info (either email, phone, or both required)
  contact_name text,
  contact_role text,
  contact_email text,
  contact_phone text,
  linkedin_url text,

  -- Provenance
  source text NOT NULL CHECK (source IN ('transparencia', 'chilecompra', 'web_scrape', 'linkedin', 'pdf', 'wayback', 'manual', 'sii')),
  source_url text,
  raw_snippet text,
  confidence numeric(3,2) DEFAULT 0.50 CHECK (confidence BETWEEN 0 AND 1),

  -- Verification
  verified_at timestamptz,
  verified_by uuid REFERENCES auth.users(id),
  bounce_count smallint DEFAULT 0,
  is_active boolean DEFAULT true,

  -- Metadata
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT contact_has_at_least_one CHECK (
    contact_email IS NOT NULL OR contact_phone IS NOT NULL OR linkedin_url IS NOT NULL
  )
);

-- Partial unique indexes (allow nulls but dedup non-null values per sostenedor)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_sost_email
  ON sostenedor_contacts (sostenedor_name, contact_email)
  WHERE contact_email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uniq_sost_phone
  ON sostenedor_contacts (sostenedor_name, contact_phone)
  WHERE contact_phone IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sost_contacts_sost ON sostenedor_contacts(sostenedor_name);
CREATE INDEX IF NOT EXISTS idx_sost_contacts_email ON sostenedor_contacts(contact_email) WHERE contact_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sost_contacts_active ON sostenedor_contacts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_sost_urls_sost ON sostenedor_urls(sostenedor_name);
CREATE INDEX IF NOT EXISTS idx_sost_urls_status ON sostenedor_urls(status);

-- Auto-update updated_at trigger (function already exists from 001)
CREATE TRIGGER sostenedor_contacts_updated_at
  BEFORE UPDATE ON sostenedor_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── RLS: admin-only (same UUID pattern as 001_prospect_tables) ──
ALTER TABLE sostenedor_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE sostenedor_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_sostenedor_urls" ON sostenedor_urls
  FOR ALL TO authenticated
  USING (auth.uid() = '169e6037-fcc2-4201-b2af-92547e1d6739')
  WITH CHECK (auth.uid() = '169e6037-fcc2-4201-b2af-92547e1d6739');

CREATE POLICY "admin_all_sostenedor_contacts" ON sostenedor_contacts
  FOR ALL TO authenticated
  USING (auth.uid() = '169e6037-fcc2-4201-b2af-92547e1d6739')
  WITH CHECK (auth.uid() = '169e6037-fcc2-4201-b2af-92547e1d6739');
