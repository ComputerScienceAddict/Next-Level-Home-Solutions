-- Supabase SQL Schema for Next Level Home Solutions
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Table: lead_submissions
-- Stores submissions from both "Get an offer" and "Send message" forms
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lead_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Form type: 'offer' | 'message'
  form_type TEXT NOT NULL CHECK (form_type IN ('offer', 'message')),

  -- Common fields (both forms)
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Offer form fields (property/cash offer)
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,

  -- Message form fields (contact form)
  subject TEXT,
  message TEXT,

  -- Consent
  agreed_communications BOOLEAN NOT NULL DEFAULT true,
  agreed_terms BOOLEAN DEFAULT false,

  -- Optional: track source (e.g. which page)
  source TEXT DEFAULT 'website'
);

CREATE INDEX IF NOT EXISTS idx_lead_submissions_created_at ON lead_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_form_type ON lead_submissions (form_type);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_email ON lead_submissions (email);

ALTER TABLE lead_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous inserts" ON lead_submissions;
CREATE POLICY "Allow anonymous inserts" ON lead_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read leads" ON lead_submissions;
CREATE POLICY "Authenticated users can read leads" ON lead_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- ---------------------------------------------------------------------------
-- Table: niche_notices
-- Mirrors NicheData notices (foreclosures, probates, liens, estate sales, etc.)
-- Synced whenever /api/leads fetches from NicheData.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS niche_notices (
  id TEXT PRIMARY KEY,
  type TEXT,
  niche_id BIGINT,
  record_type TEXT,
  state TEXT,
  county TEXT,
  city TEXT,
  zip_code TEXT,
  address TEXT,
  sale_status TEXT,
  date_of_sale TEXT,
  full_name TEXT,
  property_details JSONB,
  created_at_from_api TIMESTAMPTZ,
  updated_at_from_api TIMESTAMPTZ,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_niche_notices_record_type ON niche_notices (record_type);
CREATE INDEX IF NOT EXISTS idx_niche_notices_county ON niche_notices (county);
CREATE INDEX IF NOT EXISTS idx_niche_notices_state ON niche_notices (state);
CREATE INDEX IF NOT EXISTS idx_niche_notices_synced_at ON niche_notices (synced_at DESC);

ALTER TABLE niche_notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert for sync" ON niche_notices;
CREATE POLICY "Allow anonymous insert for sync" ON niche_notices
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous update for sync" ON niche_notices;
CREATE POLICY "Allow anonymous update for sync" ON niche_notices
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous read niche notices" ON niche_notices;
CREATE POLICY "Allow anonymous read niche notices" ON niche_notices
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Authenticated users can read niche notices" ON niche_notices;
CREATE POLICY "Authenticated users can read niche notices" ON niche_notices
  FOR SELECT TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- Table: seo_pages
-- AI-generated SEO content for city × situation pages.
-- Generated via /api/seo-generate, displayed on /sell/[situation]/[city]
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seo_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  situation_slug TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  
  -- AI-generated content
  title TEXT,
  meta_description TEXT,
  h1 TEXT,
  intro TEXT,
  local_angle TEXT,
  how_we_help JSONB,
  zip_section TEXT,
  faqs JSONB,
  cta TEXT,
  
  -- AI analysis metadata
  ai_model TEXT,
  ai_prompt_version TEXT,
  generation_notes TEXT,
  
  -- Status workflow
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published')),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  
  UNIQUE(situation_slug, city_slug)
);

CREATE INDEX IF NOT EXISTS idx_seo_pages_status ON seo_pages (status);
CREATE INDEX IF NOT EXISTS idx_seo_pages_situation ON seo_pages (situation_slug);
CREATE INDEX IF NOT EXISTS idx_seo_pages_city ON seo_pages (city_slug);

ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read published seo_pages" ON seo_pages;
CREATE POLICY "Allow anon read published seo_pages" ON seo_pages
  FOR SELECT TO anon USING (status = 'published');

DROP POLICY IF EXISTS "Allow anon insert seo_pages" ON seo_pages;
CREATE POLICY "Allow anon insert seo_pages" ON seo_pages
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update seo_pages" ON seo_pages;
CREATE POLICY "Allow anon update seo_pages" ON seo_pages
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated full access seo_pages" ON seo_pages;
CREATE POLICY "Authenticated full access seo_pages" ON seo_pages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- Table: seo_analysis
-- Stores AI market analysis results and recommendations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seo_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_type TEXT NOT NULL,
  
  -- Analysis results
  recommended_cities JSONB,
  recommended_situations JSONB,
  market_insights TEXT,
  content_gaps JSONB,
  priority_actions JSONB,
  
  -- Raw AI response for debugging
  ai_raw_response TEXT,
  ai_model TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE seo_analysis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon insert seo_analysis" ON seo_analysis;
CREATE POLICY "Allow anon insert seo_analysis" ON seo_analysis
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read seo_analysis" ON seo_analysis;
CREATE POLICY "Allow anon read seo_analysis" ON seo_analysis
  FOR SELECT TO anon USING (true);

-- ---------------------------------------------------------------------------
-- OPTIONAL: store welcome / area prefs in Supabase instead of localStorage
-- (see src/lib/client-storage-keys.ts). Handy for cross-device sync or analytics.
-- Flow: generate crypto.randomUUID() once in the browser, save as nlhs_anon_id
-- in localStorage; upsert rows by anon_key via a small API route (prefer service
-- role on the server for writes). Uncomment and run when you want this.
-- ---------------------------------------------------------------------------
-- CREATE TABLE IF NOT EXISTS visitor_preferences (
--   anon_key TEXT PRIMARY KEY,
--   preferred_situation_slug TEXT,
--   detect_area_cache JSONB,
--   updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
-- );
-- ALTER TABLE visitor_preferences ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "anon upsert own row" ON visitor_preferences
--   FOR ALL TO anon USING (true) WITH CHECK (true);
