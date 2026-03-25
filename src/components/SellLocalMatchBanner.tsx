'use client';

import Link from 'next/link';
import { useDetectArea } from '@/hooks/useDetectArea';

/** Shows when this URL’s city matches (or differs from) visitor geo detection */
export default function SellLocalMatchBanner({ pageCitySlug }: { pageCitySlug: string }) {
  const { data, loading } = useDetectArea();

  if (loading || !data || !data.matched) return null;

  if (data.city.slug === pageCitySlug) {
    return (
      <div className="mb-5 rounded-xl border border-[#c9a86c]/40 bg-black/45 px-3.5 py-3 text-[13px] leading-relaxed text-zinc-100 shadow-lg shadow-black/30 backdrop-blur-md sm:mb-6 sm:px-4 sm:py-3.5 sm:text-sm">
        <span className="font-semibold text-[#f5e6c8]">Matched to your area.</span>{' '}
        This page is focused on {data.city.name}, {data.city.state} — including what sellers often ask about here.
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-xl border border-white/25 bg-black/40 px-3.5 py-3 text-[13px] leading-relaxed text-zinc-100 shadow-md shadow-black/25 backdrop-blur-md sm:mb-6 sm:px-4 sm:py-3.5 sm:text-sm">
      <span className="text-zinc-200">Looks like you&apos;re near {data.city.name}, {data.city.state}.</span>{' '}
      <Link
        href={`/sell/${data.popularSituations[0]?.slug ?? 'foreclosure'}/${data.city.slug}`}
        className="font-semibold text-[#f5e6c8] underline decoration-[#f5e6c8]/50 underline-offset-2 transition hover:decoration-[#f5e6c8]"
      >
        View what&apos;s popular there →
      </Link>
    </div>
  );
}
