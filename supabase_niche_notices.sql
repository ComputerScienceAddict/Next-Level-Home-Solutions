-- Run this in Supabase SQL Editor if niche_notices table doesn't exist yet.
-- Creates the table and RLS so /api/leads can sync and read Fresno County leads.

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
