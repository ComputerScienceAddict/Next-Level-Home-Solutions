'use client';

import Link from 'next/link';
import { useState } from 'react';
import { business } from '@/config/business';
import { SEO_CITIES, SELLER_SITUATIONS, getSituationBySlug } from '@/data/seo-targets';

export default function AreasPage() {
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'situation-first' | 'location-first'>('situation-first');

  const situation = selectedSituation ? getSituationBySlug(selectedSituation) : null;
  const city = selectedCity ? SEO_CITIES.find((c) => c.slug === selectedCity) : null;

  const canViewPage = selectedSituation && selectedCity;

  // For a city, show situations sorted by "popular in this area" first
  const situationsForCity = (citySlug: string) => {
    const c = SEO_CITIES.find((x) => x.slug === citySlug);
    if (!c?.popularSituations?.length) return SELLER_SITUATIONS;
    const popular = c.popularSituations
      .map((slug) => getSituationBySlug(slug))
      .filter((s): s is NonNullable<typeof s> => s != null);
    const rest = SELLER_SITUATIONS.filter((s) => !c.popularSituations!.includes(s.slug));
    return [...popular, ...rest];
  };

  const states = [...new Set(SEO_CITIES.map((c) => c.state))].sort();

  return (
    <>
      <section className="relative min-h-[32vh] bg-[#2a2520] py-14 md:py-18">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139,115,85,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b7355]">Find your page</p>
          <h1 className="mt-2 font-display text-4xl text-white md:text-5xl">Areas We Serve</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">
            Select what applies to you—foreclosure, probate, divorce, inherited property, bad tenants, repairs, or
            vacant house—then pick your location. You&apos;ll get a specialized page with local info and your next steps.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setViewMode('situation-first')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                viewMode === 'situation-first'
                  ? 'bg-[#8b7355] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Pick situation first
            </button>
            <button
              onClick={() => setViewMode('location-first')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                viewMode === 'location-first'
                  ? 'bg-[#8b7355] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Pick location first
            </button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-5xl px-5">
          {viewMode === 'situation-first' ? (
            <>
              <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">1. What&apos;s your situation?</h2>
              <p className="mt-2 text-warmgray">Select what best describes why you want to sell.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {SELLER_SITUATIONS.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => {
                      setSelectedSituation(s.slug);
                      setSelectedCity(null);
                    }}
                    className={`rounded-xl border-2 p-5 text-left transition ${
                      selectedSituation === s.slug
                        ? 'border-[#8b7355] bg-[#faf9f7]'
                        : 'border-black/10 bg-white hover:border-[#8b7355]/40'
                    }`}
                  >
                    <span className="font-display text-lg font-semibold text-[#1e2d3d]">{s.title}</span>
                    <p className="mt-1 text-sm text-warmgray line-clamp-2">{s.painSummary}</p>
                  </button>
                ))}
              </div>

              {selectedSituation && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">2. Where are you?</h2>
                  <p className="mt-2 text-warmgray">Choose your city or nearest area.</p>
                  <div className="mt-6 space-y-6">
                    {states.map((state) => (
                      <div key={state}>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-warmgray">{state}</h3>
                        <div className="flex flex-wrap gap-2">
                          {SEO_CITIES.filter((c) => c.state === state).map((c) => (
                            <button
                              key={c.slug}
                              onClick={() => setSelectedCity(c.slug)}
                              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                selectedCity === c.slug
                                  ? 'bg-[#8b7355] text-white'
                                  : 'bg-[#f0ebe4] text-[#1e2d3d] hover:bg-[#8b7355]/20'
                              }`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">1. Where are you?</h2>
              <p className="mt-2 text-warmgray">Choose your city or nearest area.</p>
              <div className="mt-6 space-y-6">
                {states.map((state) => (
                  <div key={state}>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-warmgray">{state}</h3>
                    <div className="flex flex-wrap gap-2">
                      {SEO_CITIES.filter((c) => c.state === state).map((c) => (
                        <button
                          key={c.slug}
                          onClick={() => {
                            setSelectedCity(c.slug);
                            setSelectedSituation(null);
                          }}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            selectedCity === c.slug
                              ? 'bg-[#8b7355] text-white'
                              : 'bg-[#f0ebe4] text-[#1e2d3d] hover:bg-[#8b7355]/20'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {selectedCity && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">2. What&apos;s your situation?</h2>
                  <p className="mt-2 text-warmgray">
                    {city?.popularSituations?.length
                      ? "Popular in your area first—"
                      : ""}
                    Select what best describes why you want to sell.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {situationsForCity(selectedCity).map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => setSelectedSituation(s.slug)}
                        className={`rounded-xl border-2 p-5 text-left transition ${
                          selectedSituation === s.slug
                            ? 'border-[#8b7355] bg-[#faf9f7]'
                            : 'border-black/10 bg-white hover:border-[#8b7355]/40'
                        }`}
                      >
                        <span className="font-display text-lg font-semibold text-[#1e2d3d]">{s.title}</span>
                        {city?.popularSituations?.includes(s.slug) && (
                          <span className="ml-2 text-xs font-medium text-[#8b7355]">Popular here</span>
                        )}
                        <p className="mt-1 text-sm text-warmgray line-clamp-2">{s.painSummary}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {canViewPage && situation && city && (
            <div className="mt-12 rounded-2xl border-2 border-[#8b7355] bg-[#faf9f7] p-8">
              <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">Your specialized page</h2>
              <p className="mt-2 text-warmgray">
                {situation.title} in {city.name}, {city.state}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href={`/sell/${selectedSituation}/${selectedCity}`}
                  className="btn-premium inline-block"
                >
                  View my page →
                </Link>
                <a href={business.phoneTel} className="inline-flex items-center rounded-lg border-2 border-[#8b7355] px-6 py-3 text-sm font-semibold text-[#8b7355] hover:bg-[#8b7355]/5">
                  Call {business.phone}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#f8f7f5] py-12">
        <div className="mx-auto max-w-5xl px-5">
          <p className="text-sm text-warmgray">
            Don&apos;t see your city? <Link href="/contact" className="font-medium text-[#8b7355] hover:underline">Contact us</Link>—
            we may still buy in your area. California, Nevada, and Arizona covered.
          </p>
        </div>
      </section>
    </>
  );
}
