'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  { href: '/foreclosure-options', label: 'Foreclosure Options' },
  { href: '/areas', label: 'Get Help' },
  { href: '/get-offer', label: 'Get Offer' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const callClass =
    'inline-flex items-center justify-center gap-2 rounded-full border border-gold-300/35 bg-gradient-to-b from-navy-600 to-navy-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:border-gold-300/60 hover:shadow-glow-gold hover:scale-[1.02] active:scale-[0.98]';

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      scrolled 
        ? 'border-navy-600/20 bg-white/98 shadow-lg backdrop-blur-md' 
        : 'border-navy-600/10 bg-white/95 shadow-sm backdrop-blur-sm'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-2.5 sm:gap-4 sm:px-6 sm:pb-3 lg:gap-6 lg:py-3">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 sm:gap-3">
          <div className={`relative shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-offwhite to-white shadow-md ring-1 transition-all duration-300 ${
            scrolled ? 'h-10 w-10 sm:h-11 sm:w-11 ring-gold-400/20' : 'h-11 w-11 sm:h-12 sm:w-12 ring-gold-400/15'
          } group-hover:ring-gold-300/40 group-hover:shadow-lg group-hover:scale-105`}>
            <Image
              src="/logo.png"
              alt=""
              fill
              sizes="(max-width: 640px) 44px, 48px"
              className="object-contain p-[3px] sm:p-1 transition-transform group-hover:scale-105"
              priority
            />
          </div>
          <div className="min-w-0 leading-none">
            <span className={`font-display font-bold tracking-tight text-navy-600 transition-all duration-300 ${
              scrolled ? 'text-base sm:text-lg' : 'text-[1.05rem] sm:text-lg'
            }`}>
              Next Level
            </span>
            <span className={`mt-0.5 block font-body font-bold uppercase tracking-[0.22em] text-gold-400 transition-all duration-300 ${
              scrolled ? 'text-[8.5px] sm:text-[9px]' : 'text-[9px] sm:text-[10px]'
            }`}>
              Home Solutions
            </span>
          </div>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-x-6 lg:flex xl:gap-x-9">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative text-[13px] font-medium tracking-wide whitespace-nowrap transition-all duration-200 xl:text-sm ${
                pathname === link.href ||
                (link.href === '/areas' && (pathname.startsWith('/areas') || pathname.startsWith('/sell')))
                  ? 'text-navy-600'
                  : 'text-gray-600 hover:text-navy-600'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-gold transition-all duration-300 ${
                pathname === link.href ||
                (link.href === '/areas' && (pathname.startsWith('/areas') || pathname.startsWith('/sell')))
                  ? 'w-full'
                  : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
        </nav>

        <a
          href={business.phoneTel}
          className={`${callClass} hidden shrink-0 lg:inline-flex`}
          aria-label={`Call ${business.phone}`}
        >
          <PhoneIcon className="h-4 w-4 shrink-0 text-gold-300 transition-transform group-hover:rotate-12" />
          <span className="hidden xl:inline text-xs font-medium text-white/80">Call us</span>
          <span className="tabular-nums tracking-tight">{business.phone}</span>
        </a>

        <button
          type="button"
          className="touch-manipulation ml-auto flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-xl p-2 transition-all duration-200 hover:bg-navy-600/[0.06] active:bg-navy-600/[0.1] active:scale-95 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <div className="flex h-4 w-5 flex-col justify-between">
            <span className={`block h-0.5 bg-navy-600 transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-0.5 bg-navy-600 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-navy-600 transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="animate-fade-in-down border-t border-navy-600/10 bg-gradient-to-b from-white to-offwhite px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-inner lg:hidden">
          <nav className="flex max-h-[min(70dvh,520px)] flex-col gap-1 overflow-y-auto overscroll-contain rounded-xl bg-white/90 p-2 shadow-inner-premium ring-1 ring-navy-600/[0.08] [-webkit-overflow-scrolling:touch]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="touch-manipulation flex min-h-[50px] items-center rounded-lg px-4 py-3 text-[17px] font-medium text-navy-600 transition-all duration-200 hover:bg-navy-600/[0.06] active:bg-navy-600/10 active:scale-[0.98]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={business.phoneTel}
              className={`${callClass} touch-manipulation mt-3 w-full min-h-[54px] justify-center rounded-xl`}
              aria-label={`Call ${business.phone}`}
            >
              <PhoneIcon className="h-4 w-4 shrink-0 text-gold-300" />
              <span className="text-xs font-medium text-white/80">Call</span>
              <span className="tabular-nums">{business.phone}</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
