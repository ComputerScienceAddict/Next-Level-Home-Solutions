import Link from 'next/link';
import { business } from '@/config/business';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center sm:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7355]">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-[#1e2d3d] sm:text-4xl">Page not found</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-warmgray">
        That link may be out of date or the page moved. Head back home or call us &mdash; we&apos;re happy to help.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="touch-manipulation inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#1e2d3d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a3d52]"
        >
          Back to home
        </Link>
        <Link
          href="/get-offer"
          className="touch-manipulation inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#8b7355] px-6 py-3 text-sm font-semibold text-[#8b7355] transition hover:bg-[#8b7355]/5"
        >
          Get your offer
        </Link>
        <a
          href={business.phoneTel}
          className="touch-manipulation inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#c9a86c] px-6 py-3 text-sm font-bold text-[#1e2d3d] transition hover:bg-[#dfc08a]"
        >
          Call {business.phone}
        </a>
      </div>
    </main>
  );
}
