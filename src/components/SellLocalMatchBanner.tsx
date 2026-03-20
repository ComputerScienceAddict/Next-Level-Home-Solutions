'use client';

import Link from 'next/link';
import { useDetectArea } from '@/hooks/useDetectArea';

/** Shows when this URL’s city matches (or differs from) visitor geo detection */
export default function SellLocalMatchBanner({ pageCitySlug }: { pageCitySlug: string }) {
  const { data, loading } = useDetectArea();

  if (loading || !data || !data.matched) return null;

  if (data.city.slug === pageCitySlug) {
    return (
      <div className="mb-6 rounded-xl border border-[#c9a86c]/40 bg-[#c9a86c]/10 px-4 py-3 text-sm text-white/95">
        <span className="font-semibold text-[#c9a86c]">Matched to your area.</span>{' '}
        This page is focused on {data.city.name}, {data.city.state} — including what sellers often ask about here.
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/90">
      <span className="text-white/70">Looks like you&apos;re near {data.city.name}, {data.city.state}.</span>{' '}
      <Link href={`/sell/${data.popularSituations[0]?.slug ?? 'foreclosure'}/${data.city.slug}`} className="font-semibold text-[#c9a86c] underline-offset-2 hover:underline">
        View what&apos;s popular there →
      </Link>
    </div>
  );
}
