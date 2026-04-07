-- Ethoz Admin: Prospect tracking tables
-- Paste this in Supabase Dashboard → SQL Editor → Run

-- Prospect outreach tracking (one row per sostenedor)
CREATE TABLE IF NOT EXISTS prospects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sostenedor_name text NOT NULL,
  tier smallint NOT NULL DEFAULT 3 CHECK (tier IN (1, 2, 3)),
  score smallint NOT NULL DEFAULT 0,
  school_count smallint NOT NULL DEFAULT 1,
  total_enrollment integer NOT NULL DEFAULT 0,
  dep_types text,
  regions text,
  communes text,

  -- Outreach tracking
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'responded', 'demo_scheduled', 'demo_done', 'negotiating', 'won', 'lost', 'paused')),
  channel text CHECK (channel IN ('linkedin', 'email', 'whatsapp', 'phone', 'referral', 'inbound', NULL)),

  -- Contact info (enrichment)
  contact_name text,
  contact_email text,
  contact_phone text,
  contact_role text,
  linkedin_url text,
  website text,

  -- Notes & follow-up
  notes text,
  next_step text,
  next_step_date date,

  -- Metadata
  assigned_to uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Prospect activity log (timeline of interactions)
CREATE TABLE IF NOT EXISTS prospect_activities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_id uuid NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('note', 'status_change', 'email_sent', 'linkedin_sent', 'whatsapp_sent', 'call', 'demo', 'meeting', 'other')),
  description text NOT NULL,
  old_status text,
  new_status text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Content posts (for social media management)
CREATE TABLE IF NOT EXISTS content_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'youtube', 'blog', 'email', 'whatsapp')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'scheduled', 'published', 'archived')),
  scheduled_at timestamptz,
  published_at timestamptz,
  published_url text,
  image_url text,
  hashtags text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prospects_updated_at
  BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER content_posts_updated_at
  BEFORE UPDATE ON content_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS policies (admin-only access)
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;

-- Authenticated users can do everything (admin panel is auth-gated)
CREATE POLICY "Authenticated users full access" ON prospects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON prospect_activities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON content_posts FOR ALL USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_tier ON prospects(tier);
CREATE INDEX idx_prospects_next_step_date ON prospects(next_step_date);
CREATE INDEX idx_prospect_activities_prospect ON prospect_activities(prospect_id);
CREATE INDEX idx_content_posts_status ON content_posts(status);
CREATE INDEX idx_content_posts_platform ON content_posts(platform);
CREATE INDEX idx_content_posts_scheduled ON content_posts(scheduled_at);
