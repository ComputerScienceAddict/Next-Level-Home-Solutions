/**
 * Quick test: insert a row into Supabase lead_submissions
 * Run: node scripts/test-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zlitczuatzwpiiklkjsv.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_JUzpL6wsMRXs8AVJefLQng_9mb5PriA';

const supabase = createClient(url, key);

const { data, error } = await supabase
  .from('lead_submissions')
  .insert({
    form_type: 'offer',
    name: 'Test User',
    email: 'test@example.com',
    phone: '555-123-4567',
    address: '123 Test St',
    city: 'Fresno',
    state: 'CA',
    zip: '93701',
    agreed_communications: true,
    source: 'test-script',
  })
  .select('id, created_at')
  .single();

if (error) {
  console.error('Supabase error:', error.message);
  console.error('Full error:', error);
  process.exit(1);
}

console.log('Success! Inserted row:', data);
process.exit(0);
