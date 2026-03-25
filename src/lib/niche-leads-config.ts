/**
 * NicheData notices API: https://customers-api.nichedata.ai/notices
 * Queries are by US county name + record type.
 *
 * All 58 California counties.
 */
export const NICHEDATA_NOTICES_URL = 'https://customers-api.nichedata.ai/notices';

export const NICHE_SYNC_COUNTIES_CA = [
  'Alameda',
  'Alpine',
  'Amador',
  'Butte',
  'Calaveras',
  'Colusa',
  'Contra Costa',
  'Del Norte',
  'El Dorado',
  'Fresno',
  'Glenn',
  'Humboldt',
  'Imperial',
  'Inyo',
  'Kern',
  'Kings',
  'Lake',
  'Lassen',
  'Los Angeles',
  'Madera',
  'Marin',
  'Mariposa',
  'Mendocino',
  'Merced',
  'Modoc',
  'Mono',
  'Monterey',
  'Napa',
  'Nevada',
  'Orange',
  'Placer',
  'Plumas',
  'Riverside',
  'Sacramento',
  'San Benito',
  'San Bernardino',
  'San Diego',
  'San Francisco',
  'San Joaquin',
  'San Luis Obispo',
  'San Mateo',
  'Santa Barbara',
  'Santa Clara',
  'Santa Cruz',
  'Shasta',
  'Sierra',
  'Siskiyou',
  'Solano',
  'Sonoma',
  'Stanislaus',
  'Sutter',
  'Tehama',
  'Trinity',
  'Tulare',
  'Tuolumne',
  'Ventura',
  'Yolo',
  'Yuba',
] as const;

export const NICHE_RECORD_TYPES = [
  'foreclosures',
  'probates',
  'liens',
  'estate-sales',
  'lis-pendens-or-nod',
  'pre-probate',
  'guardianships',
  'divorces',
] as const;

export type NicheNotice = { id: string; type?: string; attributes?: Record<string, unknown> };

export type NicheFetchTask = { county: string; recordType: string };

export const NICHE_DEFAULT_SYNC_CONCURRENCY = 24;

/**
 * Run async work with fixed concurrency.
 */
export async function runWithConcurrency<T, R>(
  items: readonly T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const n = items.length;
  if (n === 0) return [];
  const results = new Array<R>(n);
  let next = 0;
  const limit = Math.min(Math.max(1, concurrency), n);

  async function runWorker(): Promise<void> {
    for (;;) {
      const i = next++;
      if (i >= n) return;
      results[i] = await worker(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: limit }, () => runWorker()));
  return results;
}

export function buildNicheSyncTasks(): NicheFetchTask[] {
  const tasks: NicheFetchTask[] = [];
  for (const county of NICHE_SYNC_COUNTIES_CA) {
    for (const recordType of NICHE_RECORD_TYPES) {
      tasks.push({ county, recordType });
    }
  }
  return tasks;
}

/**
 * Fetch a single page from NicheData. Sends every common pagination param
 * (per_page, limit, pageSize) so at least one works to raise the 24-row default.
 */
export async function fetchNicheNoticesPage(
  token: string,
  county: string,
  recordType: string,
  page: number = 1,
  perPage: number = 500
): Promise<{
  ok: boolean;
  status: number;
  notices: NicheNotice[];
  errorText?: string;
  rawKeys?: string[];
}> {
  const u = new URL(NICHEDATA_NOTICES_URL);
  u.searchParams.set('county', county);
  u.searchParams.set('type', recordType);
  u.searchParams.set('page', String(page));
  u.searchParams.set('per_page', String(perPage));
  u.searchParams.set('limit', String(perPage));
  u.searchParams.set('pageSize', String(perPage));

  try {
    const response = await fetch(u.toString(), {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const status = response.status;
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return { ok: false, status, notices: [], errorText: errorText.slice(0, 500) };
    }
    const data = (await response.json()) as Record<string, unknown>;
    const rawKeys = Object.keys(data);
    const list = data.data;
    const notices = Array.isArray(list) ? (list as NicheNotice[]) : [];
    return { ok: true, status, notices, rawKeys };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, notices: [], errorText: msg };
  }
}

/**
 * Walk all pages for a single county+type until no new IDs appear.
 */
export async function fetchNicheNoticesAllPages(
  token: string,
  county: string,
  recordType: string,
  perPage: number = 500
): Promise<NicheNotice[]> {
  const maxPages = 200;
  const out: NicheNotice[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= maxPages; page++) {
    const r = await fetchNicheNoticesPage(token, county, recordType, page, perPage);
    if (!r.ok || r.notices.length === 0) break;

    let added = 0;
    for (const n of r.notices) {
      const id = String(n.id);
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(n);
      added++;
    }

    // Page returned but 0 new IDs → API is repeating data, stop
    if (added === 0) break;
    // Got fewer than requested → last page
    if (r.notices.length < perPage) break;
  }

  return out;
}
