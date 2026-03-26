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
    <footer className="border-t border-white/10 bg-gradient-to-b from-[#1e2d3d] to-[#15202b] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] sm:px-5 sm:py-12 sm:pb-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                <Image
                  src="/logo.png"
                  alt=""
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-display text-lg font-bold tracking-tight text-white">Next Level Home Solutions</p>
                <p className="mt-1 max-w-sm text-sm leading-relaxed text-white/65">
                  {business.tagline}. Close in as little as 7 days when it makes sense.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c9a86c]/90">Explore</p>
            <nav className="mt-4 flex flex-col gap-1 text-sm sm:gap-2.5">
              <Link
                href="/areas"
                className="touch-manipulation rounded-lg py-2.5 text-white/80 transition hover:bg-white/[0.06] hover:text-white sm:py-0 sm:hover:bg-transparent"
              >
                Get help in your area
              </Link>
              <Link
                href="/probate-help"
                className="touch-manipulation rounded-lg py-2.5 text-white/80 transition hover:bg-white/[0.06] hover:text-white sm:py-0 sm:hover:bg-transparent"
              >
                Probate help
              </Link>
              <Link
                href="/get-offer"
                className="touch-manipulation rounded-lg py-2.5 text-white/80 transition hover:bg-white/[0.06] hover:text-white sm:py-0 sm:hover:bg-transparent"
              >
                Get your cash offer
              </Link>
            </nav>
          </div>

          <div className="lg:col-span-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c9a86c]/90">Get in touch</p>
            <div className="mt-4 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
              <a
                href={business.phoneTel}
                className="touch-manipulation flex items-center gap-3 rounded-xl py-2 text-white transition hover:bg-white/[0.04] hover:text-[#c9a86c] sm:py-1"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c9a86c]/15 text-[#c9a86c]">
                  <PhoneIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-medium uppercase tracking-wide text-white/50">Call or text</span>
                  <span className="text-base font-semibold tabular-nums">{business.phone}</span>
                </span>
              </a>
              <a
                href={`mailto:${business.contactEmail}`}
                className="mt-2 flex items-start gap-3 rounded-xl py-2 text-white transition hover:bg-white/[0.04] hover:text-[#c9a86c] sm:mt-4 sm:py-1"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c9a86c]/15 text-[#c9a86c]">
                  <MailIcon className="h-5 w-5" />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="block text-xs font-medium uppercase tracking-wide text-white/50">Email</span>
                  <span className="break-all text-sm font-medium leading-snug">{business.contactEmail}</span>
                </span>
              </a>
              <Link
                href="/get-offer"
                className="touch-manipulation mt-5 flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[#c9a86c] px-4 py-3.5 text-center text-sm font-bold text-[#1e2d3d] transition hover:bg-[#dfc08a] active:scale-[0.99]"
              >
                Get your cash offer
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Next Level Home Solutions</p>
          <p className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/terms-conditions" className="transition hover:text-white/70">
              Terms
            </Link>
            <Link href="/privacy-policy" className="transition hover:text-white/70">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
