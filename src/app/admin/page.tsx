'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import LeadsMap, { STATE_NAMES } from '@/components/LeadsMap';
import { normalizeStateCode } from '@/lib/geo-match';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';
const AUTH_KEY = 'admin_leads_auth';

/** Initial rows per table; “Load more” adds this many (keeps DOM light for huge lists). */
const LEAD_TABLE_PAGE_SIZE = 20;

function useLeadTablePagination<T>(rows: readonly T[], pageSize: number, resetKey: string) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [resetKey, pageSize, rows.length]);
  const visible = useMemo(() => rows.slice(0, visibleCount), [rows, visibleCount]);
  const hasMore = visibleCount < rows.length;
  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + pageSize, rows.length));
  }, [rows.length, pageSize]);
  return { visible, hasMore, loadMore, total: rows.length };
}

function LoadMoreRow({
  hasMore,
  onLoadMore,
  showing,
  total,
}: {
  hasMore: boolean;
  onLoadMore: () => void;
  showing: number;
  total: number;
}) {
  if (!hasMore) return null;
  return (
    <div className="mt-4 flex flex-col items-center gap-2 border-t border-black/5 pt-4">
      <p className="text-xs text-warmgray">
        Showing {showing} of {total}
      </p>
      <button
        type="button"
        onClick={onLoadMore}
        className="rounded-lg bg-[#1e2d3d] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2a3d52]"
      >
        Load more ({total - showing} remaining)
      </button>
    </div>
  );
}

interface PropertyDetails {
  propertyType?: string;
  yearBuilt?: number;
  beds?: number;
  bathsTotal?: number;
  bldgSize?: number;
}

interface NoticeAttributes {
  _id: number;
  recordType: string;
  state?: string;
  county?: string;
  city?: string;
  zipCode?: string;
  address?: string;
  saleStatus?: string;
  dateOfSale?: string;
  createdAt?: string;
  updatedAt?: string;
  fullName?: string;
  propertyDetails?: PropertyDetails;
}

interface Notice {
  id: string;
  type: string;
  attributes: NoticeAttributes;
}

export default function AdminLeadsPage() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [leads, setLeads] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [apiError, setApiError] = useState('');
  const [lastFetchMessage, setLastFetchMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const fetchGen = useRef(0);
  /** Avoid stacking multiple initial GETs when user clicks several states before the first response */
  const initialLeadsFetchInFlight = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuth(sessionStorage.getItem(AUTH_KEY) === 'true');
    }
  }, []);

  const fetchLeads = useCallback(async (sync = false) => {
    const id = ++fetchGen.current;
    setLoading(true);
    setApiError('');
    setLastFetchMessage(null);
    try {
      const url = sync
        ? '/api/leads?sync=1&t=' + Date.now()
        : '/api/leads?t=' + Date.now();
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.status}`);
      }
      const result = await response.json();
      const noticesData = result.data?.data || [];
      if (id !== fetchGen.current) return;
      setLeads(noticesData);
      setLastUpdated(new Date());
      console.log(`Loaded ${noticesData.length} leads from API (sync=${sync})`);
      return noticesData.length;
    } catch (err) {
      if (id !== fetchGen.current) return;
      console.error('Error fetching leads:', err);
      setApiError('Failed to load leads. Please try again.');
    } finally {
      if (id === fetchGen.current) {
        setLoading(false);
      }
    }
  }, []);

  // Fetch once when user picks a state; API returns all states — switching state only filters client-side
  useEffect(() => {
    if (!auth || !selectedState || leads.length > 0) return;
    if (initialLeadsFetchInFlight.current) return;
    initialLeadsFetchInFlight.current = true;
    void fetchLeads().finally(() => {
      initialLeadsFetchInFlight.current = false;
    });
  }, [auth, selectedState, leads.length, fetchLeads]);

  const handleFetchNewLeads = async () => {
    setSyncing(true);
    setApiError('');
    setLastFetchMessage(null);
    try {
      const count = await fetchLeads(true);
      if (count != null) {
        setLastFetchMessage(`Synced from NicheData: ${count} total leads now in database.`);
        setTimeout(() => setLastFetchMessage(null), 8000);
      }
    } catch {
      setApiError('Failed to fetch from NicheData. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setAuth(true);
      setUsername('');
      setPassword('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuth(false);
  };

  const isAuthed = auth === true;

  const allLeads = isAuthed ? leads : [];

  const currentLeads =
    isAuthed && selectedState
      ? allLeads.filter((l) => normalizeStateCode(l.attributes?.state) === selectedState)
      : allLeads;

  const foreclosures = currentLeads.filter((l) => l.attributes?.recordType?.toLowerCase() === 'foreclosures');
  const probates = currentLeads.filter((l) => l.attributes?.recordType?.toLowerCase() === 'probates');
  const liens = currentLeads.filter((l) => l.attributes?.recordType?.toLowerCase() === 'liens');
  const estateSales = currentLeads.filter((l) => l.attributes?.recordType?.toLowerCase() === 'estate sales');
  const otherLeads = currentLeads.filter(
    (l) =>
      !['foreclosures', 'probates', 'liens', 'estate sales'].includes(l.attributes?.recordType?.toLowerCase() || '')
  );

  const tableResetKey = `${selectedState ?? ''}-${lastUpdated?.getTime() ?? 0}-${leads.length}`;
  const fcPag = useLeadTablePagination(foreclosures, LEAD_TABLE_PAGE_SIZE, tableResetKey);
  const probPag = useLeadTablePagination(probates, LEAD_TABLE_PAGE_SIZE, tableResetKey);
  const liensPag = useLeadTablePagination(liens, LEAD_TABLE_PAGE_SIZE, tableResetKey);
  const estatePag = useLeadTablePagination(estateSales, LEAD_TABLE_PAGE_SIZE, tableResetKey);
  const otherPag = useLeadTablePagination(otherLeads, LEAD_TABLE_PAGE_SIZE, tableResetKey);

  if (auth === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-warmgray">Loading…</div>
      </div>
    );
  }

  if (!auth) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center py-16">
        <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-8 shadow-lg">
          <h1 className="font-display text-2xl font-semibold text-[#1e2d3d]">Admin Login</h1>
          <p className="mt-2 text-sm text-warmgray">Enter credentials to view leads.</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-warmgray">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full border-b-2 border-black/20 bg-transparent py-2 text-black focus:outline-none focus:border-[#8b7355]"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-warmgray">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border-b-2 border-black/20 bg-transparent py-2 text-black focus:outline-none focus:border-[#8b7355]"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-premium w-full">
              Sign in
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-black/10 py-16">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-5 lg:pl-6 lg:pr-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#1e2d3d]">Leads Dashboard</h1>
            {!selectedState ? (
              <p className="mt-1 text-sm text-warmgray">
                Click a state on the map to load leads
              </p>
            ) : loading ? (
              <p className="mt-1 text-sm text-warmgray">Loading leads…</p>
            ) : (
              <>
                <p className="mt-1 text-sm text-warmgray">
                  {currentLeads.length} listings in {STATE_NAMES[selectedState] ?? selectedState} —{' '}
                  {foreclosures.length} foreclosures, {probates.length} probates, {liens.length} liens,{' '}
                  {estateSales.length} estate sales{otherLeads.length > 0 ? `, ${otherLeads.length} other` : ''}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedState(null)}
                  className="mt-1 text-xs text-[#8b7355] hover:underline"
                >
                  ← Show all states ({allLeads.length} total)
                </button>
              </>
            )}
            {lastUpdated && (
              <p className="mt-1 text-xs text-warmgray/60">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleFetchNewLeads}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-lg bg-[#8b7355] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6f5a42] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {syncing ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
                  Fetching from NicheData…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Fetch new leads
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-warmgray hover:text-red-600 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        {lastFetchMessage && (
          <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-800">
            {lastFetchMessage}
          </div>
        )}

        {apiError && (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{apiError}</p>
            <button
              type="button"
              onClick={() => void fetchLeads()}
              className="mt-2 text-sm font-medium text-red-600 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Map left, leads beside it (capped width) — not stretched to far right */}
        <div className="mt-8 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-start xl:gap-10">
          <div className="order-1 w-full shrink-0 xl:sticky xl:top-24 xl:w-[min(100%,500px)] xl:max-w-[500px]">
            <LeadsMap 
              leads={allLeads} 
              selectedState={selectedState}
              onStateSelect={setSelectedState}
            />
          </div>
          <div className="order-2 min-w-0 w-full max-w-full xl:max-w-[960px] xl:flex-none">
            {!selectedState && (
              <div className="rounded-xl border border-black/10 bg-slate-50 p-12 text-center">
                <p className="text-warmgray">Select a state on the map to load and view leads.</p>
              </div>
            )}
            {selectedState && loading && (
              <div className="flex items-center justify-center rounded-xl border border-black/10 bg-white py-16">
                <div className="text-center">
                  <div className="mx-auto inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8b7355] border-r-transparent" />
                  <p className="mt-4 text-warmgray">Loading leads…</p>
                </div>
              </div>
            )}
            {selectedState && !loading && (
            <div key={selectedState} className="min-w-0">
            {/* Foreclosures */}
        {foreclosures.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-black">Foreclosures ({foreclosures.length})</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-[#1e2d3d] text-white">
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Address</th>
                    <th className="px-4 py-3 font-semibold">City</th>
                    <th className="px-4 py-3 font-semibold">County</th>
                    <th className="px-4 py-3 font-semibold">Zip</th>
                    <th className="px-4 py-3 font-semibold">Sale Date</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fcPag.visible.map((lead) => {
                    const attrs = lead.attributes;
                    return (
                      <tr key={lead.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                        <td className="px-4 py-3 text-warmgray">{attrs._id}</td>
                        <td className="px-4 py-3 font-medium text-[#1e2d3d]">{attrs.address || '—'}</td>
                        <td className="px-4 py-3">{attrs.city || '—'}</td>
                        <td className="px-4 py-3">{attrs.county || '—'}</td>
                        <td className="px-4 py-3">{attrs.zipCode || '—'}</td>
                        <td className="px-4 py-3">{attrs.dateOfSale || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            {attrs.saleStatus || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <LoadMoreRow
                hasMore={fcPag.hasMore}
                onLoadMore={fcPag.loadMore}
                showing={fcPag.visible.length}
                total={fcPag.total}
              />
            </div>
          </div>
        )}

        {/* Probates */}
        {probates.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-black">Probates ({probates.length})</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-[#1e2d3d] text-white">
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Address</th>
                    <th className="px-4 py-3 font-semibold">City</th>
                    <th className="px-4 py-3 font-semibold">County</th>
                    <th className="px-4 py-3 font-semibold">State</th>
                    <th className="px-4 py-3 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {probPag.visible.map((lead) => {
                    const attrs = lead.attributes;
                    return (
                      <tr key={lead.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                        <td className="px-4 py-3 text-warmgray">{attrs._id}</td>
                        <td className="px-4 py-3 font-medium text-[#1e2d3d]">{attrs.address || '—'}</td>
                        <td className="px-4 py-3">{attrs.city || '—'}</td>
                        <td className="px-4 py-3">{attrs.county || '—'}</td>
                        <td className="px-4 py-3">{attrs.state || '—'}</td>
                        <td className="px-4 py-3">
                          {attrs.createdAt ? new Date(attrs.createdAt).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <LoadMoreRow
                hasMore={probPag.hasMore}
                onLoadMore={probPag.loadMore}
                showing={probPag.visible.length}
                total={probPag.total}
              />
            </div>
          </div>
        )}

        {/* Liens */}
        {liens.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-black">Liens ({liens.length})</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-[#1e2d3d] text-white">
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Address</th>
                    <th className="px-4 py-3 font-semibold">City</th>
                    <th className="px-4 py-3 font-semibold">County</th>
                    <th className="px-4 py-3 font-semibold">Zip</th>
                  </tr>
                </thead>
                <tbody>
                  {liensPag.visible.map((lead) => {
                    const attrs = lead.attributes;
                    return (
                      <tr key={lead.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                        <td className="px-4 py-3 text-warmgray">{attrs._id}</td>
                        <td className="px-4 py-3 font-medium text-[#1e2d3d]">{attrs.address || '—'}</td>
                        <td className="px-4 py-3">{attrs.city || '—'}</td>
                        <td className="px-4 py-3">{attrs.county || '—'}</td>
                        <td className="px-4 py-3">{attrs.zipCode || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <LoadMoreRow
                hasMore={liensPag.hasMore}
                onLoadMore={liensPag.loadMore}
                showing={liensPag.visible.length}
                total={liensPag.total}
              />
            </div>
          </div>
        )}

        {/* Estate Sales */}
        {estateSales.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-black">Estate Sales ({estateSales.length})</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-[#1e2d3d] text-white">
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Address</th>
                    <th className="px-4 py-3 font-semibold">City</th>
                    <th className="px-4 py-3 font-semibold">County</th>
                    <th className="px-4 py-3 font-semibold">State</th>
                  </tr>
                </thead>
                <tbody>
                  {estatePag.visible.map((lead) => {
                    const attrs = lead.attributes;
                    return (
                      <tr key={lead.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                        <td className="px-4 py-3 text-warmgray">{attrs._id}</td>
                        <td className="px-4 py-3 font-medium text-[#1e2d3d]">{attrs.address || '—'}</td>
                        <td className="px-4 py-3">{attrs.city || '—'}</td>
                        <td className="px-4 py-3">{attrs.county || '—'}</td>
                        <td className="px-4 py-3">{attrs.state || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <LoadMoreRow
                hasMore={estatePag.hasMore}
                onLoadMore={estatePag.loadMore}
                showing={estatePag.visible.length}
                total={estatePag.total}
              />
            </div>
          </div>
        )}

        {/* Other Leads */}
        {otherLeads.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-black">Other Leads ({otherLeads.length})</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-[#1e2d3d] text-white">
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Address</th>
                    <th className="px-4 py-3 font-semibold">City</th>
                    <th className="px-4 py-3 font-semibold">County</th>
                  </tr>
                </thead>
                <tbody>
                  {otherPag.visible.map((lead) => {
                    const attrs = lead.attributes;
                    return (
                      <tr key={lead.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                        <td className="px-4 py-3 text-warmgray">{attrs._id}</td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                            {attrs.recordType || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-[#1e2d3d]">{attrs.address || '—'}</td>
                        <td className="px-4 py-3">{attrs.city || '—'}</td>
                        <td className="px-4 py-3">{attrs.county || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <LoadMoreRow
                hasMore={otherPag.hasMore}
                onLoadMore={otherPag.loadMore}
                showing={otherPag.visible.length}
                total={otherPag.total}
              />
            </div>
          </div>
        )}

            {currentLeads.length === 0 && !apiError && (
              <div className="mt-10 rounded-xl border border-black/10 bg-white p-12 text-center">
                <p className="text-warmgray">
                  {allLeads.length > 0 && selectedState ? (
                    <>
                      No listings in {STATE_NAMES[selectedState] ?? selectedState} right now.
                      <span className="mt-2 block text-sm">
                        You have {allLeads.length} lead{allLeads.length === 1 ? '' : 's'} in other
                        states — pick another state on the map.
                      </span>
                    </>
                  ) : leads.length > 0 && selectedState ? (
                    <>
                      No listings match the active filter for {STATE_NAMES[selectedState] ?? selectedState}. Try
                      another state or use <strong>Fetch new leads</strong>.
                    </>
                  ) : (
                    'No active listings at this time.'
                  )}
                </p>
              </div>
            )}
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
