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
