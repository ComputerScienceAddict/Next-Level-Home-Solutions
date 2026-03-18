-- Supabase SQL Schema for Next Level Home Solutions lead forms
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: lead_submissions
-- Stores submissions from both "Get an offer" and "Send message" forms
CREATE TABLE lead_submissions (
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

-- Indexes for common queries
CREATE INDEX idx_lead_submissions_created_at ON lead_submissions (created_at DESC);
CREATE INDEX idx_lead_submissions_form_type ON lead_submissions (form_type);
CREATE INDEX idx_lead_submissions_email ON lead_submissions (email);

-- Row Level Security (RLS) - enable for Supabase Auth
ALTER TABLE lead_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for form submissions) - no auth required
CREATE POLICY "Allow anonymous inserts" ON lead_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Only authenticated users (e.g. admins) can read
CREATE POLICY "Authenticated users can read leads" ON lead_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Optional: If you want to allow service_role to do everything (for API/backend)
-- The service_role key bypasses RLS by default, so no extra policy needed.

-- Optional: Add a trigger to log or notify on new submissions
-- CREATE OR REPLACE FUNCTION notify_new_lead()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   -- Could integrate with Supabase Edge Functions, webhooks, etc.
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER on_lead_submitted
--   AFTER INSERT ON lead_submissions
--   FOR EACH ROW EXECUTE FUNCTION notify_new_lead();

-- ---------------------------------------------------------------------------
-- Table: niche_notices
-- Mirrors NicheData notices (foreclosures, probates, liens, estate sales, etc.)
-- including county. Synced whenever /api/leads fetches from NicheData.
-- ---------------------------------------------------------------------------
CREATE TABLE niche_notices (
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

CREATE INDEX idx_niche_notices_record_type ON niche_notices (record_type);
CREATE INDEX idx_niche_notices_county ON niche_notices (county);
CREATE INDEX idx_niche_notices_state ON niche_notices (state);
CREATE INDEX idx_niche_notices_synced_at ON niche_notices (synced_at DESC);

ALTER TABLE niche_notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert for sync" ON niche_notices
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update for sync" ON niche_notices
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
-- API uses anon key to read leads (admin fetches via /api/leads)
CREATE POLICY "Allow anonymous read niche notices" ON niche_notices
  FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated users can read niche notices" ON niche_notices
  FOR SELECT TO authenticated USING (true);
