import Link from 'next/link';
import type { Metadata } from 'next';
import GoogleAdsQuoteConversion from '@/components/GoogleAdsQuoteConversion';

export const metadata: Metadata = {
  title: 'Thank you | Next Level Home Solutions',
  description: 'We received your request for a cash offer.',
  robots: { index: false, follow: true },
};

export default function QuoteThankYouPage() {
  return (
    <>
      <GoogleAdsQuoteConversion />
      <section className="min-h-[80vh] bg-gradient-to-b from-black/5 to-transparent">
        <div className="mx-auto max-w-xl px-5 py-16 md:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-warmgray hover:text-[#8b7355] transition-colors mb-8"
          >
            <span aria-hidden>←</span> Back to home
          </Link>
          <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1e2d3d] via-[#8b7355] to-[#1e2d3d]" />
            <div className="p-6 sm:p-8 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b7355]">Request received</p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[#1e2d3d] md:text-[2rem]">
                Thank you
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-warmgray/90">
                We received your quote request and will be in touch soon—usually the same day. If you need us right
                away, call{' '}
                <a href="tel:559-991-2190" className="font-semibold text-[#8b7355] hover:underline">
                  559-991-2190
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
