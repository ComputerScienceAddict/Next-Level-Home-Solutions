'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { requestBrowserLocation } from '@/lib/browser-geolocation';
import { useDetectArea } from '@/hooks/useDetectArea';
import { getPreferredSituationSlug } from '@/lib/user-prefs';

/**
 * Homepage block: uses visitor location (GPS when allowed, else IP / Vercel geo) to show popular situations near them.
 */
export default function LocalForYouHome() {
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const { data, loading } = useDetectArea({
    enabled: true,
    lat: gpsCoords?.lat,
    lng: gpsCoords?.lng,
  });
  const [preferredSlug, setPreferredSlug] = useState<string | null>(null);

  useEffect(() => {
    setPreferredSlug(getPreferredSituationSlug());
  }, []);

  useEffect(() => {
    requestBrowserLocation(8000).then((result) => {
      if (result.status === 'granted') {
        setGpsCoords({ lat: result.lat, lng: result.lng });
      }
    });
  }, []);

  if (loading || !data) {
    return (
      <section className="border-b border-black/10 bg-[#1e2d3d] py-6" aria-hidden>
        <div className="mx-auto max-w-5xl px-5">
          <div className="h-14 animate-pulse rounded-lg bg-white/5" />
        </div>
      </section>
    );
  }

  if (!data.matched) {
    return (
      <section className="border-b border-black/10 bg-gradient-to-r from-[#1e2d3d] to-[#2a3d52] py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-5 sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a86c]">14 states: FL · TX · GA · OH · AL · VA · NY · NJ · AZ · LA · KS · NV · CA</p>
          <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">Find help for your city & situation</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/75">
            Pick your area and what you&apos;re dealing with—we&apos;ll show what&apos;s most common there and your personalized page.
          </p>
          <Link
            href="/areas"
            className="mt-5 inline-flex items-center gap-2 bg-[#c9a86c] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#1e2d3d] transition hover:bg-white"
          >
            Choose my area & situation →
          </Link>
        </div>
      </section>
    );
  }

  /**
   * IP/geo often returns only a region; we map that to a “hub” SEO city (e.g. Fresno for CA).
   * Funneling everyone to that hub URL feels wrong — ask them to pick their real city.
   */
  if (data.approximate) {
    const { city, detectedCityName } = data;
    return (
      <section className="border-b border-black/10 bg-gradient-to-r from-[#1e2d3d] to-[#2a3d52] py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-5 sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a86c]">Based on a general location signal</p>
          <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">Choose your city for the right local page</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
            {detectedCityName ? (
              <>
                We only have a rough idea (near <span className="font-medium text-white">{detectedCityName}</span>,{' '}
                {city.state}). We don&apos;t auto-open a default hub city — pick yours so the county and ZIPs match where
                you are.
              </>
            ) : (
              <>
                We could only narrow this to <span className="font-medium text-white">{city.state}</span>. Pick your city
                below so we don&apos;t send you to a generic area that isn&apos;t yours.
              </>
            )}
          </p>
          <Link
            href="/areas"
            className="mt-5 inline-flex min-h-[48px] items-center gap-2 bg-[#c9a86c] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#1e2d3d] transition hover:bg-white"
          >
            Choose my city & situation →
          </Link>
        </div>
      </section>
    );
  }

  const { city, popularSituations } = data;
  let orderedPopular = popularSituations;
  if (preferredSlug) {
    const idx = popularSituations.findIndex((p) => p.slug === preferredSlug);
    if (idx > 0) {
      const next = [...popularSituations];
      const [picked] = next.splice(idx, 1);
      orderedPopular = [picked, ...next];
    }
  }

  const label = `${city.name}, ${city.state} — here’s what homeowners near you often need help with`;

  return (
    <section className="border-b-2 border-[#c9a86c]/30 bg-gradient-to-r from-[#1e2d3d] via-[#243447] to-[#1e2d3d] py-10">
      <div className="mx-auto max-w-5xl px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a86c]">Based on your location</p>
        <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">Popular in your area</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">{label}</p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {orderedPopular.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/sell/${p.slug}/${city.slug}`}
                className={`inline-flex items-center rounded-xl border-2 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#c9a86c] hover:bg-[#c9a86c]/20 ${
                  preferredSlug === p.slug
                    ? 'border-[#c9a86c] bg-[#c9a86c]/15'
                    : 'border-white/20 bg-white/10'
                }`}
              >
                {p.shortLabel}
                {preferredSlug === p.slug && (
                  <span className="ml-2 text-[10px] font-normal uppercase tracking-wide text-[#c9a86c]">Your pick</span>
                )}
                <span className="ml-2 text-white/60">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
          <Link href="/areas" className="text-sm font-medium text-[#c9a86c] underline-offset-4 hover:underline">
            Change city or situation
          </Link>
          <span className="hidden text-white/30 sm:inline">|</span>
          <Link
            href={`/sell/${orderedPopular[0]?.slug ?? 'foreclosure'}/${city.slug}`}
            className="text-sm text-white/70 hover:text-white"
          >
            View full page for top match →
          </Link>
        </div>
      </div>
    </section>
  );
}
