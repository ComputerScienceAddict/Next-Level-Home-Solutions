'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { business } from '@/config/business';
import { SEO_CITIES, SELLER_SITUATIONS } from '@/data/seo-targets';

type SeoPage = {
  id: string;
  situation_slug: string;
  city_slug: string;
  title: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  updated_at: string;
};

type Analysis = {
  source: string;
  timestamp: string;
  marketAnalysis: {
    topCities: { slug: string; name: string; priority: string; reason: string }[];
    topSituations: { slug: string; title: string; priority: string; reason: string }[];
  };
  contentStrategy: {
    immediateActions: string[];
    contentGaps: string[];
    competitiveInsights: string[];
  };
  metrics: {
    totalPagesConfigured: number;
    citiesConfigured: number;
    situationsConfigured: number;
  };
  summary: string;
};

export default function AdminSeoPage() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'generate' | 'pages'>('overview');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingCity, setGeneratingCity] = useState<string | null>(null);
  const [generatingSituation, setGeneratingSituation] = useState<string | null>(null);
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/admin/session', { credentials: 'include' });
        const data = (await res.json()) as { ok?: boolean };
        if (!cancelled) setAuth(data.ok === true);
      } catch {
        if (!cancelled) setAuth(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runAnalysis = async () => {
    setAnalyzing(true);
    setMessage(null);
    try {
      const res = await fetch('/api/seo-analyze', { credentials: 'include' });
      if (res.status === 401) {
        setAuth(false);
        setMessage({ type: 'error', text: 'Session expired. Log in from the main admin page.' });
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: (data as { error?: string }).error || 'Analysis failed' });
        return;
      }
      setAnalysis(data);
      setMessage({ type: 'success', text: `Analysis complete (${data.source})` });
    } catch {
      setMessage({ type: 'error', text: 'Analysis failed' });
    } finally {
      setAnalyzing(false);
    }
  };

  const generateContent = async (situation: string, city: string) => {
    setGenerating(true);
    setGeneratingCity(city);
    setGeneratingSituation(situation);
    setMessage(null);
    try {
      const res = await fetch('/api/seo-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ situation, city }),
      });
      if (res.status === 401) {
        setAuth(false);
        setMessage({ type: 'error', text: 'Session expired. Log in from the main admin page.' });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Generated: ${situation}/${city}` });
        fetchPages();
      } else {
        setMessage({ type: 'error', text: data.error || 'Generation failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Generation failed' });
    } finally {
      setGenerating(false);
      setGeneratingCity(null);
      setGeneratingSituation(null);
    }
  };

  const generateAllForCity = async (city: string) => {
    setGenerating(true);
    setGeneratingCity(city);
    setMessage(null);
    try {
      for (const s of SELLER_SITUATIONS) {
        setGeneratingSituation(s.slug);
        const batchRes = await fetch('/api/seo-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ situation: s.slug, city }),
        });
        if (batchRes.status === 401) {
          setAuth(false);
          setMessage({ type: 'error', text: 'Session expired. Log in from the main admin page.' });
          return;
        }
        await new Promise((r) => setTimeout(r, 300));
      }
      setMessage({ type: 'success', text: `Generated all situations for ${city}` });
      fetchPages();
    } catch {
      setMessage({ type: 'error', text: 'Batch generation failed' });
    } finally {
      setGenerating(false);
      setGeneratingCity(null);
      setGeneratingSituation(null);
    }
  };

  const fetchPages = async () => {
    setLoadingPages(true);
    try {
      const res = await fetch('/api/seo-pages', { credentials: 'include' });
      if (res.status === 401) {
        setAuth(false);
        return;
      }
      const data = await res.json();
      setPages(data.pages || []);
    } catch {
      console.error('Failed to fetch pages');
    } finally {
      setLoadingPages(false);
    }
  };

  const updatePageStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/seo-pages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, status }),
      });
      fetchPages();
    } catch {
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  useEffect(() => {
    if (auth && activeTab === 'pages') {
      fetchPages();
    }
  }, [auth, activeTab]);

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
        <div className="text-center">
          <p className="text-warmgray">Please log in via the main admin page first.</p>
          <Link href="/admin" className="mt-4 inline-block text-[#8b7355] hover:underline">
            Go to Admin Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#1e2d3d]">SEO Content Manager</h1>
            <p className="mt-1 text-sm text-warmgray">AI-powered market analysis and content generation</p>
          </div>
          <Link href="/admin" className="text-sm text-warmgray hover:text-[#8b7355]">
            ← Back to Leads
          </Link>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-lg px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-black/10 mb-8">
          <nav className="flex gap-8">
            {(['overview', 'analysis', 'generate', 'pages'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab
                    ? 'border-[#8b7355] text-[#1e2d3d]'
                    : 'border-transparent text-warmgray hover:text-[#1e2d3d]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-black/10 bg-white p-6">
                <p className="text-xs uppercase tracking-wider text-warmgray">Total Pages</p>
                <p className="mt-2 font-display text-3xl text-[#1e2d3d]">
                  {SEO_CITIES.length * SELLER_SITUATIONS.length}
                </p>
                <p className="mt-1 text-sm text-warmgray">
                  {SEO_CITIES.length} cities × {SELLER_SITUATIONS.length} situations
                </p>
              </div>
              <div className="rounded-xl border border-black/10 bg-white p-6">
                <p className="text-xs uppercase tracking-wider text-warmgray">Business</p>
                <p className="mt-2 font-display text-xl text-[#1e2d3d]">{business.name}</p>
                <p className="mt-1 text-sm text-warmgray">{business.primaryMarket}</p>
              </div>
              <div className="rounded-xl border border-black/10 bg-white p-6">
                <p className="text-xs uppercase tracking-wider text-warmgray">Quick Actions</p>
                <div className="mt-3 space-y-2">
                  <button
                    onClick={runAnalysis}
                    disabled={analyzing}
                    className="w-full rounded-lg bg-[#8b7355] px-4 py-2 text-sm font-medium text-white hover:bg-[#6f5a42] disabled:opacity-50"
                  >
                    {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
                  </button>
                  <Link
                    href="/areas"
                    className="block w-full rounded-lg border border-[#8b7355] px-4 py-2 text-center text-sm font-medium text-[#8b7355] hover:bg-[#8b7355]/5"
                  >
                    View Live Pages
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-6">
              <h2 className="font-display text-xl font-semibold text-[#1e2d3d]">How This Works</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-[#faf9f7] p-4">
                  <p className="font-medium text-[#1e2d3d]">1. Analysis</p>
                  <p className="mt-1 text-sm text-warmgray">
                    AI analyzes your business and markets to recommend which cities and situations to prioritize.
                  </p>
                </div>
                <div className="rounded-lg bg-[#faf9f7] p-4">
                  <p className="font-medium text-[#1e2d3d]">2. Generate</p>
                  <p className="mt-1 text-sm text-warmgray">
                    AI creates unique SEO content for each city × situation page with local context.
                  </p>
                </div>
                <div className="rounded-lg bg-[#faf9f7] p-4">
                  <p className="font-medium text-[#1e2d3d]">3. Review</p>
                  <p className="mt-1 text-sm text-warmgray">
                    Review AI-generated content and approve it before publishing to your live site.
                  </p>
                </div>
                <div className="rounded-lg bg-[#faf9f7] p-4">
                  <p className="font-medium text-[#1e2d3d]">4. Live</p>
                  <p className="mt-1 text-sm text-warmgray">
                    New AI pages save as <strong>published</strong> and replace templates on /sell/… within about 2 minutes (ISR).
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-6">
              <h2 className="font-display text-xl font-semibold text-[#1e2d3d]">Configured Situations</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {SELLER_SITUATIONS.map((s) => (
                  <span
                    key={s.slug}
                    className="rounded-full bg-[#f0ebe4] px-3 py-1 text-sm font-medium text-[#1e2d3d]"
                  >
                    {s.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-warmgray">AI analyzes your business and recommends which markets to target.</p>
              <button
                onClick={runAnalysis}
                disabled={analyzing}
                className="rounded-lg bg-[#8b7355] px-6 py-2 text-sm font-medium text-white hover:bg-[#6f5a42] disabled:opacity-50"
              >
                {analyzing ? 'Analyzing...' : 'Run Analysis'}
              </button>
            </div>

            {analysis && (
              <div className="space-y-6">
                <div className="rounded-xl border border-black/10 bg-white p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        analysis.source === 'ai' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {analysis.source === 'ai' ? 'AI Powered' : 'Heuristic'}
                    </span>
                    <span className="text-xs text-warmgray">{new Date(analysis.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-warmgray">{analysis.summary}</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-xl border border-black/10 bg-white p-6">
                    <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">Priority Cities</h3>
                    <div className="mt-4 space-y-3">
                      {analysis.marketAnalysis.topCities.slice(0, 8).map((c) => (
                        <div key={c.slug} className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 rounded px-2 py-0.5 text-xs font-medium ${
                              c.priority === 'high'
                                ? 'bg-green-100 text-green-800'
                                : c.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {c.priority}
                          </span>
                          <div>
                            <p className="font-medium text-[#1e2d3d]">{c.name}</p>
                            <p className="text-sm text-warmgray">{c.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-black/10 bg-white p-6">
                    <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">Priority Situations</h3>
                    <div className="mt-4 space-y-3">
                      {analysis.marketAnalysis.topSituations.map((s) => (
                        <div key={s.slug} className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 rounded px-2 py-0.5 text-xs font-medium ${
                              s.priority === 'high'
                                ? 'bg-green-100 text-green-800'
                                : s.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {s.priority}
                          </span>
                          <div>
                            <p className="font-medium text-[#1e2d3d]">{s.title}</p>
                            <p className="text-sm text-warmgray">{s.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 bg-white p-6">
                  <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">Recommended Actions</h3>
                  <ul className="mt-4 space-y-2">
                    {analysis.contentStrategy.immediateActions.map((action, i) => (
                      <li key={i} className="flex gap-3 text-warmgray">
                        <span className="font-medium text-[#8b7355]">{i + 1}.</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {analysis.contentStrategy.contentGaps.length > 0 && (
                  <div className="rounded-xl border border-black/10 bg-white p-6">
                    <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">Content Gaps</h3>
                    <ul className="mt-4 space-y-2">
                      {analysis.contentStrategy.contentGaps.map((gap, i) => (
                        <li key={i} className="flex gap-3 text-warmgray">
                          <span className="text-amber-500">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!analysis && !analyzing && (
              <div className="rounded-xl border border-black/10 bg-white p-12 text-center">
                <p className="text-warmgray">Click &ldquo;Run Analysis&rdquo; to get AI-powered market recommendations.</p>
              </div>
            )}
          </div>
        )}

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-black/10 bg-white p-6">
              <h2 className="font-display text-xl font-semibold text-[#1e2d3d]">Generate AI Content by City</h2>
              <p className="mt-2 text-sm text-warmgray">
                Click a city to generate unique SEO content for all {SELLER_SITUATIONS.length} situations in that market.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SEO_CITIES.map((city) => (
                <div key={city.slug} className="rounded-xl border border-black/10 bg-white p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">
                        {city.name}, {city.state}
                      </h3>
                      <p className="text-xs text-warmgray">{city.county} County</p>
                      <p className="mt-1 text-xs text-warmgray">ZIPs: {city.zips.join(', ')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => generateAllForCity(city.slug)}
                    disabled={generating}
                    className="mt-4 w-full rounded-lg bg-[#8b7355] px-4 py-2 text-sm font-medium text-white hover:bg-[#6f5a42] disabled:opacity-50"
                  >
                    {generating && generatingCity === city.slug
                      ? `Generating ${generatingSituation || '...'}...`
                      : `Generate All (${SELLER_SITUATIONS.length} pages)`}
                  </button>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {SELLER_SITUATIONS.map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => generateContent(s.slug, city.slug)}
                        disabled={generating}
                        className="rounded bg-[#f0ebe4] px-2 py-1 text-xs font-medium text-[#1e2d3d] hover:bg-[#8b7355]/20 disabled:opacity-50"
                        title={`Generate ${s.title} page for ${city.name}`}
                      >
                        {s.shortLabel}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-warmgray">Review and manage AI-generated SEO pages.</p>
              <button
                onClick={fetchPages}
                disabled={loadingPages}
                className="text-sm text-[#8b7355] hover:underline"
              >
                {loadingPages ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {pages.length > 0 ? (
              <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-black/10 bg-[#1e2d3d] text-white">
                      <th className="px-4 py-3 font-semibold">Page</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Updated</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#1e2d3d]">
                            {page.situation_slug} / {page.city_slug}
                          </p>
                          <p className="text-xs text-warmgray truncate max-w-xs">{page.title}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-medium ${
                              page.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : page.status === 'approved'
                                ? 'bg-blue-100 text-blue-800'
                                : page.status === 'review'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {page.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-warmgray">
                          {new Date(page.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Link
                              href={`/sell/${page.situation_slug}/${page.city_slug}`}
                              className="text-xs text-[#8b7355] hover:underline"
                              target="_blank"
                            >
                              Preview
                            </Link>
                            {page.status === 'draft' && (
                              <button
                                onClick={() => updatePageStatus(page.id, 'review')}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Mark Review
                              </button>
                            )}
                            {page.status === 'review' && (
                              <button
                                onClick={() => updatePageStatus(page.id, 'approved')}
                                className="text-xs text-green-600 hover:underline"
                              >
                                Approve
                              </button>
                            )}
                            {page.status === 'approved' && (
                              <button
                                onClick={() => updatePageStatus(page.id, 'published')}
                                className="text-xs text-green-600 hover:underline"
                              >
                                Publish
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-black/10 bg-white p-12 text-center">
                <p className="text-warmgray">
                  {loadingPages ? 'Loading pages...' : 'No AI-generated pages yet. Go to Generate tab to create some.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
