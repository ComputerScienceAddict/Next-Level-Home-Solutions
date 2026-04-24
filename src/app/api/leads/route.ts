import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdminOr401 } from '@/lib/admin-auth';
import {
  NICHE_DEFAULT_SYNC_CONCURRENCY,
  buildNicheSyncTasks,
  fetchNicheNoticesAllPages,
  runWithConcurrency,
  type NicheNotice,
} from '@/lib/niche-leads-config';

export const dynamic = 'force-dynamic';

const UPSERT_CHUNK = 400;

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

function buildSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
    global: { fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }) },
  });
}

async function readAllFromSupabase(supabase: NonNullable<ReturnType<typeof buildSupabase>>) {
  const allRows: Record<string, unknown>[] = [];
  let from = 0;
  const PAGE = 1000;
  for (;;) {
    const { data: chunk, error } = await supabase
      .from('niche_notices')
      .select('*')
      .order('synced_at', { ascending: false })
      .range(from, from + PAGE - 1);

    if (error) {
      if (error.message?.includes('schema cache') || error.code === '42P01') return [];
      throw new Error(error.message);
    }
    if (!chunk || chunk.length === 0) break;
    allRows.push(...(chunk as Record<string, unknown>[]));
    if (chunk.length < PAGE) break;
    from += PAGE;
  }
  return allRows;
}

function rowsToNotices(rows: Record<string, unknown>[]) {
  return rows.map((row) => ({
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
}

/**
 * GET /api/leads  — read-only (fast, no sync)
 * GET /api/leads?sync=1 — sync from NicheData first, then read (used by "Fetch new leads" button)
 */
export async function GET(request: Request) {
  const denied = requireAdminOr401(request);
  if (denied) return denied;

  try {
    const supabase = buildSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const url = new URL(request.url);
    const shouldSync = url.searchParams.get('sync') === '1';

    if (shouldSync) {
      const token = process.env.NICHEDATA_API_TOKEN;
      if (token) {
        const concurrency = Math.min(
          64,
          Math.max(1, Number(process.env.NICHE_SYNC_CONCURRENCY) || NICHE_DEFAULT_SYNC_CONCURRENCY)
        );
        const tasks = buildNicheSyncTasks();
        console.log(`[leads sync] Starting: ${tasks.length} county×type combos, concurrency=${concurrency}`);
        const t0 = Date.now();

        const perCountyResults = await runWithConcurrency(tasks, concurrency, async ({ county, recordType }) => {
          const notices = await fetchNicheNoticesAllPages(token, county, recordType);
          if (notices.length > 0) {
            console.log(`[leads sync] ${county} / ${recordType}: ${notices.length} notices`);
          }
          return notices;
        });

        const seenIds = new Set<string>();
        const allNotices: NicheNotice[] = [];
        const countByType: Record<string, number> = {};

        for (const batch of perCountyResults) {
          for (const notice of batch) {
            const id = String(notice.id);
            if (seenIds.has(id)) continue;
            seenIds.add(id);
            allNotices.push(notice);
            const rt = (notice.attributes as Record<string, unknown>)?.recordType as string || 'unknown';
            countByType[rt] = (countByType[rt] || 0) + 1;
          }
        }

        console.log(`[leads sync] Done in ${Date.now() - t0}ms — ${allNotices.length} unique notices`);
        console.log(`[leads sync] Breakdown:`, JSON.stringify(countByType));

        if (allNotices.length > 0) {
          const rows = allNotices.map(noticeToRow);
          for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
            const chunk = rows.slice(i, i + UPSERT_CHUNK);
            const { error } = await supabase.from('niche_notices').upsert(chunk, { onConflict: 'id' });
            if (error) console.error('[leads sync] Supabase upsert error:', error.message);
          }
          console.log(`[leads sync] Upserted ${rows.length} rows`);
        }
      } else {
        console.warn('[leads sync] No NICHEDATA_API_TOKEN set');
      }
    }

    const rows = await readAllFromSupabase(supabase);
    const notices = rowsToNotices(rows);

    return NextResponse.json({
      success: true,
      data: { data: notices },
      count: notices.length,
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
