import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

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

type NicheNotice = { id: string; type?: string; attributes?: Record<string, unknown> };

async function fetchNicheData(token: string, county: string, recordType: string): Promise<NicheNotice[]> {
  const url = `${NICHEDATA_BASE}?county=${county}&type=${recordType}`;
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) return [];
  const data = await response.json();
  const list = data?.data ?? [];
  return Array.isArray(list) ? list : [];
}

function noticeToRow(notice: NicheNotice) {
  const attrs = notice.attributes ?? {};
  const a = attrs as Record<string, unknown>;
  return {
    id: String(notice.id),
    type: notice.type ?? null,
    niche_id: a._id != null ? Number(a._id) : null,
    record_type: (a.recordType as string) ?? null,
    state: (a.state as string) ?? null,
    county: (a.county as string) ?? null,
    city: (a.city as string) ?? null,
    zip_code: (a.zipCode as string) ?? null,
    address: (a.address as string) ?? null,
    sale_status: (a.saleStatus as string) ?? null,
    date_of_sale: (a.dateOfSale as string) ?? null,
    full_name: (a.fullName as string) ?? null,
    property_details: a.propertyDetails ?? null,
    created_at_from_api: a.createdAt ? String(a.createdAt) : null,
    updated_at_from_api: a.updatedAt ? String(a.updatedAt) : null,
  };
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }) },
    });

    // Fetch all record types from NicheData across Fresno + nearby counties
    const token = process.env.NICHEDATA_API_TOKEN;
    if (token) {
      const seenIds = new Set<string>();
      const allNotices: NicheNotice[] = [];

      for (const county of COUNTIES) {
        for (const recordType of RECORD_TYPES) {
          const page = await fetchNicheData(token, county, recordType);
          for (const notice of page) {
            const id = String(notice.id);
            if (seenIds.has(id)) continue;
            seenIds.add(id);
            allNotices.push(notice);
          }
        }
      }

      if (allNotices.length > 0) {
        const rows = allNotices.map(noticeToRow);
        const { error } = await supabase.from('niche_notices').upsert(rows, { onConflict: 'id' });
        if (error) console.error('Supabase niche_notices sync error:', error.message);
      }
    }

    // Return leads from Supabase (same shape admin expects)
    const { data: rows, error } = await supabase
      .from('niche_notices')
      .select('*')
      .order('synced_at', { ascending: false });

    if (error) {
      console.error('Supabase niche_notices read error:', error.message);
      // If table doesn't exist yet, return empty list so admin still loads
      if (error.message?.includes('schema cache') || error.code === '42P01') {
        return NextResponse.json({
          success: true,
          data: { data: [] },
          timestamp: new Date().toISOString(),
        });
      }
      return NextResponse.json(
        { error: 'Failed to load leads from database' },
        { status: 500 }
      );
    }

    const notices = (rows ?? []).map((row: Record<string, unknown>) => ({
      id: row.id,
      type: row.type ?? '',
      attributes: {
        _id: row.niche_id,
        recordType: row.record_type ?? '',
        state: row.state ?? '',
        county: row.county ?? '',
        city: row.city ?? '',
        zipCode: row.zip_code ?? '',
        address: row.address ?? '',
        saleStatus: row.sale_status ?? '',
        dateOfSale: row.date_of_sale ?? '',
        fullName: row.full_name ?? '',
        propertyDetails: row.property_details ?? undefined,
        createdAt: row.created_at_from_api ?? '',
        updatedAt: row.updated_at_from_api ?? '',
      },
    }));

    return NextResponse.json({
      success: true,
      data: { data: notices },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in leads API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
