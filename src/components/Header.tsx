'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-we-work', label: 'How We Work' },
  { href: '/stay-in-your-home', label: 'Stay in Home' },
  { href: '/probate-help', label: 'Probate Help' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-navy/20 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-center gap-4 transition">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy p-2 transition group-hover:bg-[#1e2d3d]/90">
            <Image src="/logo.png" alt="" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <span className="block font-display text-xl font-bold tracking-tight text-navy">Next Level</span>
            <span className="block font-body text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8b7355]">Home Solutions</span>
          </div>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                pathname === link.href || (link.href === '/#faq' && pathname === '/')
                  ? 'text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a href="tel:559-991-2190" className="btn-call hidden md:inline-block">
          559-991-2190
        </a>

        <button
          type="button"
          className="md:hidden p-2 -m-2"
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
        <div className="border-t-2 border-black/10 bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-black" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <a href="tel:559-991-2190" className="btn-call inline-block w-fit text-center">
              559-991-2190
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
