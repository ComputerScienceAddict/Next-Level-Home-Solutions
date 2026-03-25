'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { business } from '@/config/business';
import { SEO_CITIES, SELLER_SITUATIONS, getSituationBySlug } from '@/data/seo-targets';
import { useDetectArea } from '@/hooks/useDetectArea';

export default function AreasPage() {
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'situation-first' | 'location-first'>('location-first');
  const userPickedCity = useRef(false);
  const { data: geo } = useDetectArea();

  useEffect(() => {
    if (!geo || !('matched' in geo) || !geo.matched) return;
    if (userPickedCity.current) return;
    // Rough IP → state hub is approximate; don't pre-select Fresno (etc.) — user must pick their city.
    if (geo.approximate) return;
    setSelectedCity(geo.city.slug);
    setViewMode('location-first');
  }, [geo]);

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

  const situationListForStep1 =
    viewMode === 'situation-first' && selectedCity
      ? situationsForCity(selectedCity)
      : SELLER_SITUATIONS;

  return (
    <>
      <section className="relative min-h-[min(36vh,320px)] overflow-hidden bg-[#2a2520] py-10 sm:min-h-[32vh] sm:py-14 md:py-16">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139,115,85,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a86c] sm:text-xs sm:tracking-[0.25em]">
            Find your page
          </p>
          <h1 className="mt-2 font-display text-[1.75rem] leading-tight text-white sm:text-4xl md:text-5xl">Areas We Serve</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/88 sm:mt-6 sm:text-lg">
            We use your general location (not exact address) to highlight what&apos;s popular in your area and open the
            right page. You can change city anytime.
          </p>
          {geo && 'matched' in geo && geo.matched && (
            <p className="mt-4 max-w-2xl rounded-xl border border-[#c9a86c]/40 bg-black/25 px-4 py-3 text-sm leading-relaxed text-white/90 sm:px-5">
              <span className="font-semibold text-[#e8d4a8]">
                {geo.approximate && geo.detectedCityName
                  ? `Near ${geo.detectedCityName}, ${geo.city.state}`
                  : geo.approximate
                    ? `${geo.city.state} (general area)`
                    : `${geo.city.name}, ${geo.city.state}`}
              </span>
              {geo.approximate
                ? ' — pick your city below; we don’t auto-select a default hub.'
                : ' — popular situations for your area are listed first below.'}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
            <button
              type="button"
              onClick={() => setViewMode('situation-first')}
              className={`touch-manipulation min-h-[48px] rounded-xl px-4 py-3 text-sm font-semibold transition sm:min-h-0 sm:py-2 ${
                viewMode === 'situation-first'
                  ? 'bg-[#8b7355] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Pick situation first
            </button>
            <button
              type="button"
              onClick={() => setViewMode('location-first')}
              className={`touch-manipulation min-h-[48px] rounded-xl px-4 py-3 text-sm font-semibold transition sm:min-h-0 sm:py-2 ${
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

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          {viewMode === 'situation-first' ? (
            <>
              <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">1. What&apos;s your situation?</h2>
              <p className="mt-2 text-warmgray">Select what best describes why you want to sell.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {situationListForStep1.map((s) => {
                  const pop =
                    selectedCity &&
                    SEO_CITIES.find((c) => c.slug === selectedCity)?.popularSituations?.includes(s.slug);
                  return (
                    <button
                      type="button"
                      key={s.slug}
                      onClick={() => setSelectedSituation(s.slug)}
                      className={`touch-manipulation min-h-[52px] rounded-xl border-2 p-4 text-left transition sm:min-h-0 sm:p-5 ${
                        selectedSituation === s.slug
                          ? 'border-[#8b7355] bg-[#faf9f7]'
                          : 'border-black/10 bg-white hover:border-[#8b7355]/40'
                      }`}
                    >
                      <span className="font-display text-lg font-semibold text-[#1e2d3d]">{s.title}</span>
                      {pop && (
                        <span className="ml-2 text-xs font-medium text-[#8b7355]">Popular in your area</span>
                      )}
                      <p className="mt-1 text-sm text-warmgray line-clamp-2">{s.painSummary}</p>
                    </button>
                  );
                })}
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
                              type="button"
                              key={c.slug}
                              onClick={() => {
                                userPickedCity.current = true;
                                setSelectedCity(c.slug);
                              }}
                              className={`touch-manipulation min-h-[44px] rounded-xl px-3.5 py-2.5 text-sm font-medium transition sm:min-h-0 sm:rounded-lg sm:px-4 sm:py-2 ${
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
                          type="button"
                          key={c.slug}
                          onClick={() => {
                            userPickedCity.current = true;
                            setSelectedCity(c.slug);
                            setSelectedSituation(null);
                          }}
                          className={`touch-manipulation min-h-[44px] rounded-xl px-3.5 py-2.5 text-sm font-medium transition sm:min-h-0 sm:rounded-lg sm:px-4 sm:py-2 ${
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
                        type="button"
                        key={s.slug}
                        onClick={() => setSelectedSituation(s.slug)}
                        className={`touch-manipulation min-h-[52px] rounded-xl border-2 p-4 text-left transition sm:min-h-0 sm:p-5 ${
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
            <div className="mt-10 rounded-2xl border-2 border-[#8b7355] bg-[#faf9f7] p-5 sm:mt-12 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-[#1e2d3d] sm:text-2xl">Your specialized page</h2>
              <p className="mt-2 text-warmgray">
                {situation.title} in {city.name}, {city.state}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link
                  href={`/sell/${selectedSituation}/${selectedCity}`}
                  className="btn-premium touch-manipulation flex min-h-[48px] items-center justify-center text-center sm:inline-flex"
                >
                  View my page →
                </Link>
                <a
                  href={business.phoneTel}
                  className="touch-manipulation flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#8b7355] px-6 py-3 text-sm font-semibold text-[#8b7355] hover:bg-[#8b7355]/5 sm:inline-flex"
                >
                  Call {business.phone}
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#f8f7f5] py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <p className="text-sm text-warmgray">
            Don&apos;t see your city? <Link href="/contact" className="font-medium text-[#8b7355] hover:underline">Contact us</Link>—
            we may still buy in your area. FL, TX, GA, OH, AL, VA, NY, NJ, AZ, LA, KS, NV & CA covered.
          </p>
        </div>
      </section>
    </>
  );
}
