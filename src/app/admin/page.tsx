'use client';

import { useEffect, useState } from 'react';
import { leads } from '@/data/leads';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';
const AUTH_KEY = 'admin_leads_auth';

export default function AdminLeadsPage() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuth(sessionStorage.getItem(AUTH_KEY) === 'true');
    }
  }, []);

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

  const foreclosures = leads.filter((l) => l.lead_source === 'foreclosure_list');
  const offmarket = leads.filter((l) => l.lead_source === 'offmarket_prospect');

  return (
    <section className="border-t border-black/10 py-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#1e2d3d]">Leads</h1>
            <p className="mt-1 text-sm text-warmgray">
              Fresno area — {foreclosures.length} foreclosure sales, {offmarket.length} off-market prospects
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-warmgray hover:text-red-600 transition-colors"
          >
            Log out
          </button>
        </div>

        {/* Foreclosure leads */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-black">Foreclosure sales</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-[#1e2d3d] text-white">
                  <th className="px-4 py-3 font-semibold">Address</th>
                  <th className="px-4 py-3 font-semibold">TS #</th>
                  <th className="px-4 py-3 font-semibold">Sale date</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Days until</th>
                  <th className="px-4 py-3 font-semibold">Priority</th>
                  <th className="px-4 py-3 font-semibold">Postponement</th>
                </tr>
              </thead>
              <tbody>
                {foreclosures.map((lead, i) => (
                  <tr key={i} className="border-b border-black/5 hover:bg-black/[0.02]">
                    <td className="px-4 py-3 font-medium text-[#1e2d3d]">{lead.address}</td>
                    <td className="px-4 py-3 text-warmgray">{lead.ts_number || '—'}</td>
                    <td className="px-4 py-3">{lead.sale_date || '—'}</td>
                    <td className="px-4 py-3">{lead.sale_time || '—'}</td>
                    <td className="px-4 py-3">{lead.days_until_sale || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          lead.approach_priority === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {lead.approach_priority || '—'}
                      </span>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-warmgray" title={lead.postponement_info || ''}>
                      {lead.postponement_info || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Off-market prospects */}
        <div className="mt-12">
          <h2 className="font-display text-xl font-semibold text-black">Off-market prospects</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-[#1e2d3d] text-white">
                  <th className="px-4 py-3 font-semibold">Rank</th>
                  <th className="px-4 py-3 font-semibold">Address</th>
                  <th className="px-4 py-3 font-semibold">Property type</th>
                  <th className="px-4 py-3 font-semibold">Est. value</th>
                  <th className="px-4 py-3 font-semibold">Equity</th>
                  <th className="px-4 py-3 font-semibold">Priority</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {offmarket.map((lead, i) => (
                  <tr key={i} className="border-b border-black/5 hover:bg-black/[0.02]">
                    <td className="px-4 py-3 font-medium text-[#1e2d3d]">{lead.offmarket_priority_rank || '—'}</td>
                    <td className="px-4 py-3 font-medium text-[#1e2d3d]">{lead.address}</td>
                    <td className="px-4 py-3 text-warmgray">{lead.property_type || '—'}</td>
                    <td className="px-4 py-3">
                      {lead.est_value ? `$${Number(lead.est_value).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3">{lead.equity_pct || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          lead.approach_priority === 'high'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.approach_priority === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {lead.approach_priority || '—'}
                      </span>
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-warmgray" title={lead.offmarket_notes || ''}>
                      {lead.offmarket_notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
