'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/sell', label: 'Areas' },
  { href: '/how-we-work', label: 'How It Works' },
  { href: '/probate-help', label: 'Probate' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-navy/20 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4 sm:px-8 lg:gap-8 lg:py-5">
        <Link href="/" className="group flex shrink-0 items-center gap-3 transition sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy p-2 transition group-hover:bg-[#1e2d3d]/90">
            <Image src="/logo.png" alt="" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <span className="block font-display text-xl font-bold tracking-tight text-navy">Next Level</span>
            <span className="block font-body text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8b7355]">Home Solutions</span>
          </div>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-x-6 lg:flex xl:gap-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide whitespace-nowrap transition ${
                pathname === link.href ||
                (link.href === '/#faq' && pathname === '/') ||
                (link.href === '/sell' && pathname.startsWith('/sell'))
                  ? 'text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href="tel:559-991-2190"
          className="btn-call hidden shrink-0 self-center lg:inline-flex"
          aria-label="Call 559-991-2190"
        >
          559-991-2190
        </a>

        <button
          type="button"
          className="ml-auto shrink-0 p-3 -m-2 min-h-[44px] min-w-[44px] flex items-center justify-center lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="flex h-4 w-5 flex-col justify-between">
            <span className={`block h-0.5 bg-black transition ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-0.5 bg-black ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-black transition ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t-2 border-black/10 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-base py-2 text-black min-h-[44px] flex items-center" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <a
              href="tel:559-991-2190"
              className="btn-call mt-2 inline-flex w-full min-h-[48px] items-center justify-center text-center sm:w-fit sm:min-w-[200px]"
              aria-label="Call 559-991-2190"
            >
              559-991-2190
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
