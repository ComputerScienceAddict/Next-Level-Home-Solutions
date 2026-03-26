'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { business } from '@/config/business';

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/areas', label: 'Get Help' },
  { href: '/probate-help', label: 'Probate Help' },
  { href: '/get-offer', label: 'Get Offer' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const callClass =
    'inline-flex items-center justify-center gap-2 rounded-full border border-[#c9a86c]/35 bg-gradient-to-b from-[#1e2d3d] to-[#152430] px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(30,45,61,0.2)] transition hover:border-[#c9a86c]/60 hover:shadow-[0_4px_18px_rgba(30,45,61,0.28)] hover:brightness-[1.03] active:scale-[0.98]';

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e2d3d]/10 bg-white/95 shadow-[0_1px_0_rgba(30,45,61,0.06)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-2 sm:gap-4 sm:px-6 sm:pb-2.5 lg:gap-6 lg:py-2.5">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 sm:gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#faf8f5] to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(30,45,61,0.08)] ring-1 ring-[#8b7355]/15 transition group-hover:ring-[#c9a86c]/40 sm:h-12 sm:w-12">
            <Image
              src="/logo.png"
              alt=""
              fill
              sizes="(max-width: 640px) 44px, 48px"
              className="object-contain p-[3px] sm:p-1"
              priority
            />
          </div>
          <div className="min-w-0 leading-none">
            <span className="font-display text-[1.05rem] font-bold tracking-tight text-[#1e2d3d] sm:text-lg">
              Next Level
            </span>
            <span className="mt-0.5 block font-body text-[9px] font-bold uppercase tracking-[0.22em] text-[#8b7355] sm:text-[10px]">
              Home Solutions
            </span>
          </div>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-x-5 lg:flex xl:gap-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-medium tracking-wide whitespace-nowrap transition xl:text-sm ${
                pathname === link.href ||
                (link.href === '/areas' && (pathname.startsWith('/areas') || pathname.startsWith('/sell')))
                  ? 'text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={business.phoneTel}
          className={`${callClass} hidden shrink-0 lg:inline-flex`}
          aria-label={`Call ${business.phone}`}
        >
          <PhoneIcon className="h-4 w-4 shrink-0 text-[#c9a86c]" />
          <span className="hidden xl:inline text-xs font-medium text-white/75">Call us</span>
          <span className="tabular-nums tracking-tight">{business.phone}</span>
        </a>

        <button
          type="button"
          className="touch-manipulation ml-auto flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-xl p-2 transition hover:bg-black/[0.04] active:bg-black/[0.06] lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <div className="flex h-4 w-5 flex-col justify-between">
            <span className={`block h-0.5 bg-black transition ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-0.5 bg-black ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-black transition ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-black/10 bg-gradient-to-b from-white to-[#faf9f7] px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-inner lg:hidden">
          <nav className="flex max-h-[min(70dvh,520px)] flex-col gap-0.5 overflow-y-auto overscroll-contain rounded-xl bg-white/80 p-2 ring-1 ring-black/[0.06] [-webkit-overflow-scrolling:touch]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="touch-manipulation flex min-h-[48px] items-center rounded-lg px-3 py-3 text-[17px] font-medium text-[#1e2d3d] transition hover:bg-[#1e2d3d]/[0.06] active:bg-[#1e2d3d]/10"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={business.phoneTel}
              className={`${callClass} touch-manipulation mt-2 w-full min-h-[52px] justify-center rounded-xl sm:w-auto sm:self-stretch`}
              aria-label={`Call ${business.phone}`}
            >
              <PhoneIcon className="h-4 w-4 shrink-0 text-[#c9a86c]" />
              <span className="text-xs font-medium text-white/80">Call</span>
              <span className="tabular-nums">{business.phone}</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
