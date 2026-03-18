/**
 * Test: 1) Store NicheData Fresno-area leads in Supabase, 2) Fetch leads from Supabase.
 * Run: node scripts/test-niche-supabase.mjs
 * (Loads .env.local from project root)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const envPath = join(root, '.env.local');
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  });
}

const NICHEDATA_BASE = 'https://customers-api.nichedata.ai/notices';
const COUNTIES = ['Fresno', 'Tulare'];
const RECORD_TYPES = [
  'foreclosures',
  'probates',
  'liens',
  'estate-sales',
  'lis-pendens-or-nod',
  'pre-probate',
  'guardianships',
  'divorces',
];

async function fetchNicheData(token, county, recordType) {
  const url = `${NICHEDATA_BASE}?county=${county}&type=${recordType}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const list = data?.data ?? [];
  return Array.isArray(list) ? list : [];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const token = process.env.NICHEDATA_API_TOKEN;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('--- Step 1: Fetch from NicheData (Fresno area) and store in Supabase ---');
  if (!token) {
    console.warn('No NICHEDATA_API_TOKEN; skipping sync. Will only read from Supabase.');
  } else {
    const seenIds = new Set();
    const allNotices = [];

    for (const county of COUNTIES) {
      console.log(`\n  County: ${county}`);
      for (const recordType of RECORD_TYPES) {
        const page = await fetchNicheData(token, county, recordType);
        let added = 0;
        for (const notice of page) {
          const id = String(notice.id);
          if (seenIds.has(id)) continue;
          seenIds.add(id);
          allNotices.push(notice);
          added++;
        }
        if (page.length > 0) {
          console.log(`    ${recordType}: ${page.length} returned, ${added} new unique`);
        }
      }
    }

    if (allNotices.length === 0) {
      console.log('\nNicheData returned 0 notices across all counties/types.');
    } else {
      const rows = allNotices.map((notice) => {
        const attrs = notice.attributes ?? {};
        return {
          id: String(notice.id),
          type: notice.type ?? null,
          niche_id: attrs._id != null ? Number(attrs._id) : null,
          record_type: attrs.recordType ?? null,
          state: attrs.state ?? null,
          county: attrs.county ?? null,
          city: attrs.city ?? null,
          zip_code: attrs.zipCode ?? null,
          address: attrs.address ?? null,
          sale_status: attrs.saleStatus ?? null,
          date_of_sale: attrs.dateOfSale ?? null,
          full_name: attrs.fullName ?? null,
          property_details: attrs.propertyDetails ?? null,
          created_at_from_api: attrs.createdAt ? String(attrs.createdAt) : null,
          updated_at_from_api: attrs.updatedAt ? String(attrs.updatedAt) : null,
        };
      });
      const { error } = await supabase.from('niche_notices').upsert(rows, { onConflict: 'id' });
      if (error) {
        console.error('Supabase upsert error:', error.message);
        process.exit(1);
      }
      console.log('\nStored in Supabase: ' + rows.length + ' unique notices.');
    }
  }

  console.log('\n--- Step 2: Fetch leads FROM Supabase ---');
  const { data: rows, error } = await supabase
    .from('niche_notices')
    .select('id, niche_id, address, city, county, zip_code, record_type, sale_status, date_of_sale')
    .order('synced_at', { ascending: false });

  if (error) {
    console.error('Supabase read error:', error.message);
    process.exit(1);
  }

  const list = rows ?? [];
  const byType = {};
  const byCounty = {};
  for (const r of list) {
    const t = (r.record_type || 'unknown').toLowerCase();
    byType[t] = (byType[t] || 0) + 1;
    const c = (r.county || 'unknown');
    byCounty[c] = (byCounty[c] || 0) + 1;
  }
  const typeBreakdown = Object.entries(byType).map(([t, c]) => `${c} ${t}`).join(', ');
  const countyBreakdown = Object.entries(byCounty).map(([t, c]) => `${c} in ${t}`).join(', ');
  console.log(`Fetched from Supabase: ${list.length} total leads`);
  console.log(`  By type: ${typeBreakdown}`);
  console.log(`  By county: ${countyBreakdown}`);

  console.log('\nDone.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
