-- Run this in Supabase SQL Editor if inserts are blocked by RLS
-- This allows anonymous (form) submissions to insert rows

-- Remove existing insert policy
DROP POLICY IF EXISTS "Allow anonymous inserts" ON lead_submissions;

-- Create policy that allows all roles to insert (anon key, etc.)
CREATE POLICY "Allow anonymous inserts" ON lead_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);
