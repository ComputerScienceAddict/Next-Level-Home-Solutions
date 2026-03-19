'use client';

import { useEffect, useState } from 'react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';
const AUTH_KEY = 'admin_leads_auth';

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
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [apiError, setApiError] = useState('');
  const [lastFetchMessage, setLastFetchMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuth(sessionStorage.getItem(AUTH_KEY) === 'true');
    }
  }, []);

  useEffect(() => {
    if (auth) {
      fetchLeads();
    }
  }, [auth]);

  const fetchLeads = async () => {
    setLoading(true);
    setApiError('');
    setLastFetchMessage(null);
    try {
      const response = await fetch('/api/leads?t=' + Date.now());
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.status}`);
      }
      const result = await response.json();
      const noticesData = result.data?.data || [];
      setLeads(noticesData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching leads:', err);
      setApiError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchNewLeads = async () => {
    setSyncing(true);
    setApiError('');
    setLastFetchMessage(null);
    try {
      const response = await fetch('/api/leads?t=' + Date.now());
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.status}`);
      }
      const result = await response.json();
      const noticesData = result.data?.data || [];
      setLeads(noticesData);
      setLastUpdated(new Date());
      setLastFetchMessage(`Updated: ${noticesData.length} total leads synced from NicheData.`);
      setTimeout(() => setLastFetchMessage(null), 5000);
    } catch (err) {
      console.error('Error fetching leads:', err);
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8b7355] border-r-transparent"></div>
          <p className="mt-4 text-warmgray">Loading leads…</p>
        </div>
      </div>
    );
  }

  // Only show listings with status "active" (exclude Pending, postponed, sold, cancelled, closed, etc.)
  const currentLeads = leads.filter((l) => (l.attributes?.saleStatus || '').toLowerCase() === 'active');

  const foreclosures = currentLeads.filter((l) => l.attributes?.recordType?.toLowerCase() === 'foreclosures');
  const probates = currentLeads.filter((l) => l.attributes?.recordType?.toLowerCase() === 'probates');
  const liens = currentLeads.filter((l) => l.attributes?.recordType?.toLowerCase() === 'liens');
  const estateSales = currentLeads.filter((l) => l.attributes?.recordType?.toLowerCase() === 'estate sales');
  const otherLeads = currentLeads.filter(
    (l) =>
      !['foreclosures', 'probates', 'liens', 'estate sales'].includes(l.attributes?.recordType?.toLowerCase() || '')
  );

  return (
    <section className="border-t border-black/10 py-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#1e2d3d]">Leads Dashboard</h1>
            <p className="mt-1 text-sm text-warmgray">
              {currentLeads.length} active listings — {foreclosures.length} foreclosures, {probates.length} probates, {liens.length} liens, {estateSales.length} estate sales
            </p>
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
              onClick={fetchLeads}
              className="mt-2 text-sm font-medium text-red-600 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

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
                  {foreclosures.map((lead) => {
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
                  {probates.map((lead) => {
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
                  {liens.map((lead) => {
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
                  {estateSales.map((lead) => {
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
                  {otherLeads.map((lead) => {
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
            </div>
          </div>
        )}

        {currentLeads.length === 0 && !apiError && (
          <div className="mt-10 rounded-xl border border-black/10 bg-white p-12 text-center">
            <p className="text-warmgray">No active listings at this time.</p>
          </div>
        )}
      </div>
    </section>
  );
}
