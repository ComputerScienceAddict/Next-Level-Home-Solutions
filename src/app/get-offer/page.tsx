import ContactForm from '@/components/ContactForm';
import { labelForForeclosureInterest } from '@/lib/foreclosure-interest';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Your Cash Offer | Next Level Home Solutions',
  description: 'Get a fair cash offer for your home today. Same day response, no obligation, no commissions. Sell your house fast in Fresno, CA. Call 559-991-2190.',
  openGraph: {
    title: 'Get Your Cash Offer | Next Level Home Solutions',
    description: 'Get a fair cash offer for your home today. Same day response, no obligation, no commissions.',
  },
};

type SearchParams = { interest?: string | string[] };

export default function GetOfferPage({ searchParams }: { searchParams?: SearchParams }) {
  const raw = searchParams?.interest;
  const interestSlug = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined;
  const interestLabel = labelForForeclosureInterest(interestSlug);
  const leadContext = interestLabel ? `Foreclosure options — interested in: ${interestLabel}` : null;

  return (
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
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b7355]">Free, no obligation</p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[#1e2d3d] md:text-[2rem]">
              Get your cash offer
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-warmgray/90">
              {interestLabel ? (
                <>
                  You selected <strong className="text-[#1e2d3d]">{interestLabel}</strong>. Tell us about your
                  situation and property &mdash; we&apos;ll respond same day and help you weigh every option, not
                  just a cash sale.
                </>
              ) : (
                <>Fill out the form below. We&apos;ll respond same day with a fair cash offer.</>
              )}
            </p>
            <div className="mt-8">
              <ContactForm leadContext={leadContext} />
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-warmgray/80">
          Prefer to talk? <a href="tel:559-991-2190" className="font-semibold text-[#8b7355] hover:underline">Call 559-991-2190</a>
        </p>
      </div>
    </section>
  );
}
