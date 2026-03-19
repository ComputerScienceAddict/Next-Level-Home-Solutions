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
