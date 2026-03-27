'use client';

import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { business } from '@/config/business';
import { SEO_CITIES, SELLER_SITUATIONS, getSituationBySlug } from '@/data/seo-targets';
import { useDetectArea } from '@/hooks/useDetectArea';

function AreasPageInner() {
  const searchParams = useSearchParams();
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const userPickedCity = useRef(false);
  const { data: geo } = useDetectArea();

  useEffect(() => {
    const sit = searchParams.get('situation');
    if (sit && getSituationBySlug(sit)) {
      setSelectedSituation(sit);
    }
    const citySlug = searchParams.get('city');
    if (citySlug && SEO_CITIES.some((c) => c.slug === citySlug)) {
      userPickedCity.current = true;
      setSelectedCity(citySlug);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!geo || !('matched' in geo) || !geo.matched) return;
    if (userPickedCity.current) return;
    if (geo.approximate) return;
    setSelectedCity(geo.city.slug);
  }, [geo]);

  const situation = selectedSituation ? getSituationBySlug(selectedSituation) : null;
  const city = selectedCity ? SEO_CITIES.find((c) => c.slug === selectedCity) : null;
  const canViewPage = selectedSituation && selectedCity;
  const states = [...new Set(SEO_CITIES.map((c) => c.state))].sort();

  return (
    <>
      <section className="bg-[#2a2520] py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a86c] sm:text-xs">
            Step 1 of 2
          </p>
          <h1 className="mt-2 font-display text-[1.75rem] leading-tight text-white sm:text-4xl">
            Find help in your area
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/80">
            Pick what you need help with, then choose your city. We&apos;ll open a page built for your situation.
          </p>
          {geo && 'matched' in geo && geo.matched && !geo.approximate && (
            <p className="mt-4 rounded-lg border border-[#c9a86c]/30 bg-black/20 px-4 py-2.5 text-sm text-white/90">
              <span className="font-semibold text-[#e8d4a8]">{geo.city.name}, {geo.city.state}</span>
              {' '}&mdash; auto-selected based on your location.
            </p>
          )}
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">What do you need help with?</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SELLER_SITUATIONS.map((s) => (
              <button
                type="button"
                key={s.slug}
                onClick={() => setSelectedSituation(s.slug)}
                className={`touch-manipulation min-h-[52px] rounded-xl border-2 p-4 text-left transition ${
                  selectedSituation === s.slug
                    ? 'border-[#8b7355] bg-[#faf9f7]'
                    : 'border-black/10 bg-white hover:border-[#8b7355]/40'
                }`}
              >
                <span className="font-display text-lg font-semibold text-[#1e2d3d]">{s.title}</span>
                <p className="mt-1 text-sm text-warmgray line-clamp-2">{s.shortLabel}</p>
              </button>
            ))}
          </div>

          {selectedSituation && (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">Where is the home?</h2>
              <div className="mt-5 space-y-5">
                {states.map((state) => (
                  <div key={state}>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-warmgray">{state}</h3>
                    <div className="flex flex-wrap gap-2">
                      {SEO_CITIES.filter((c) => c.state === state).map((c) => (
                        <button
                          type="button"
                          key={c.slug}
                          onClick={() => {
                            userPickedCity.current = true;
                            setSelectedCity(c.slug);
                          }}
                          className={`touch-manipulation min-h-[44px] rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
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

          {canViewPage && situation && city && (
            <div className="mt-10 rounded-2xl border-2 border-[#8b7355] bg-[#faf9f7] p-5 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-[#1e2d3d] sm:text-2xl">
                {situation.title} in {city.name}, {city.state}
              </h2>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-4">
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

      <section className="border-t border-black/10 bg-[#f8f7f5] py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <p className="text-sm text-warmgray">
            Don&apos;t see your city?{' '}
            <a href={business.phoneTel} className="font-medium text-[#8b7355] hover:underline">Call {business.phone}</a>
            &mdash; we may still buy in your area.
          </p>
        </div>
      </section>
    </>
  );
}

export default function AreasPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-16 text-center text-warmgray sm:px-5">Loading…</div>
      }
    >
      <AreasPageInner />
    </Suspense>
  );
}
