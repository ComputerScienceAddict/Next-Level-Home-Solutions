'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDetectArea } from '@/hooks/useDetectArea';
import { getPreferredSituationSlug } from '@/lib/user-prefs';

/**
 * Homepage block: uses visitor location (IP / Vercel geo) to show popular situations near them.
 */
export default function LocalForYouHome() {
  const { data, loading } = useDetectArea();
  const [preferredSlug, setPreferredSlug] = useState<string | null>(null);

  useEffect(() => {
    setPreferredSlug(getPreferredSituationSlug());
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
        <div className="mx-auto max-w-5xl px-5 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a86c]">California · Nevada · Arizona</p>
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

  const { city, popularSituations, approximate, detectedCityName } = data;
  let orderedPopular = popularSituations;
  if (preferredSlug) {
    const idx = popularSituations.findIndex((p) => p.slug === preferredSlug);
    if (idx > 0) {
      const next = [...popularSituations];
      const [picked] = next.splice(idx, 1);
      orderedPopular = [picked, ...next];
    }
  }

  const label =
    approximate && detectedCityName
      ? `Near ${detectedCityName}, ${city.state} — showing our ${city.name} hub & what sellers ask about most there`
      : `${city.name}, ${city.state} — here’s what homeowners near you often need help with`;

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
