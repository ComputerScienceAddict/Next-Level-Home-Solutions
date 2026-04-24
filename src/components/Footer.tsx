import Image from 'next/image';
import Link from 'next/link';
import { business } from '@/config/business';

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-gold-300/20 bg-gradient-to-b from-navy-600 via-navy-700 to-navy-800 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy-600/50 via-transparent to-transparent opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 pb-[max(3rem,env(safe-area-inset-bottom,0px))] sm:px-6 sm:py-16 sm:pb-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 shadow-lg ring-1 ring-white/20 backdrop-blur-sm transition-all hover:bg-white/15 hover:scale-105">
                <Image
                  src="/logo.png"
                  alt=""
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-display text-xl font-bold tracking-tight text-white">Next Level Home Solutions</p>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/75">
                  {business.tagline}. Get a <span className="font-semibold text-gold-300">fair cash offer in 24 hours</span> and close in as little as 7 days.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="trust-badge">
                <svg className="h-4 w-4 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Licensed & Insured
              </div>
              <div className="trust-badge">
                <svg className="h-4 w-4 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                500+ Homes
              </div>
              <div className="trust-badge">
                <svg className="h-4 w-4 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                </svg>
                Fast Closings
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300">Explore</p>
            <nav className="mt-5 flex flex-col gap-3 text-sm">
              <Link
                href="/foreclosure-options"
                className="group touch-manipulation flex items-center gap-2 rounded-lg py-2.5 text-white/80 transition-all hover:text-white sm:py-1.5"
              >
                <span className="h-1 w-1 rounded-full bg-gold-300/50 transition-all group-hover:w-6 group-hover:bg-gold-300" />
                Foreclosure options
              </Link>
              <Link
                href="/areas"
                className="group touch-manipulation flex items-center gap-2 rounded-lg py-2.5 text-white/80 transition-all hover:text-white sm:py-1.5"
              >
                <span className="h-1 w-1 rounded-full bg-gold-300/50 transition-all group-hover:w-6 group-hover:bg-gold-300" />
                Get help in your area
              </Link>
              <Link
                href="/probate-help"
                className="group touch-manipulation flex items-center gap-2 rounded-lg py-2.5 text-white/80 transition-all hover:text-white sm:py-1.5"
              >
                <span className="h-1 w-1 rounded-full bg-gold-300/50 transition-all group-hover:w-6 group-hover:bg-gold-300" />
                Probate help
              </Link>
              <Link
                href="/get-offer"
                className="group touch-manipulation flex items-center gap-2 rounded-lg py-2.5 text-white/80 transition-all hover:text-white sm:py-1.5"
              >
                <span className="h-1 w-1 rounded-full bg-gold-300/50 transition-all group-hover:w-6 group-hover:bg-gold-300" />
                Get your cash offer
              </Link>
            </nav>
          </div>

          <div className="lg:col-span-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300">Get in touch</p>
            <div className="mt-5 rounded-2xl bg-white/[0.06] p-6 shadow-lg ring-1 ring-white/10 backdrop-blur-sm">
              <a
                href={business.phoneTel}
                className="group touch-manipulation flex items-center gap-3 rounded-xl p-3 text-white transition-all hover:bg-white/[0.06] hover:scale-[1.02] active:scale-[0.99] sm:p-2"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold-300/20 text-gold-300 shadow-inner transition-all group-hover:bg-gold-300/30 group-hover:scale-110">
                  <PhoneIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-medium uppercase tracking-wide text-white/60">Call or text</span>
                  <span className="text-base font-semibold tabular-nums">{business.phone}</span>
                </span>
              </a>
              <a
                href={`mailto:${business.contactEmail}`}
                className="group mt-3 flex items-start gap-3 rounded-xl p-3 text-white transition-all hover:bg-white/[0.06] hover:scale-[1.02] active:scale-[0.99] sm:mt-4 sm:p-2"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold-300/20 text-gold-300 shadow-inner transition-all group-hover:bg-gold-300/30 group-hover:scale-110">
                  <MailIcon className="h-5 w-5" />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="block text-xs font-medium uppercase tracking-wide text-white/60">Email</span>
                  <span className="break-all text-sm font-medium leading-snug">{business.contactEmail}</span>
                </span>
              </a>
              <Link
                href="/get-offer"
                className="btn-gold touch-manipulation mt-6 flex w-full min-h-[50px] items-center justify-center"
              >
                Get your cash offer
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Next Level Home Solutions. All rights reserved.</p>
          <p className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            <Link href="/terms-conditions" className="transition hover:text-gold-300">
              Terms
            </Link>
            <Link href="/privacy-policy" className="transition hover:text-gold-300">
              Privacy
            </Link>
            <Link href="/accessibility" className="transition hover:text-gold-300">
              Accessibility
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
