import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-navy text-white">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10 p-2">
              <Image src="/logo.png" alt="Next Level Home Solutions" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <p className="font-body text-lg font-bold uppercase tracking-tight">Next Level</p>
              <p className="font-body text-sm font-medium uppercase tracking-widest text-white/80">Home Solutions</p>
              <p className="mt-2 text-sm text-white/70">
                Cash offers. Sell as-is. Close in as little as 7 days.
              </p>
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Links</p>
              <div className="mt-2 flex flex-col gap-1 text-sm">
                <Link href="/how-we-work" className="text-white/80 transition hover:text-white">How We Work</Link>
                <Link href="/stay-in-your-home" className="text-white/80 transition hover:text-white">Stay in Home</Link>
                <Link href="/probate-help" className="text-white/80 transition hover:text-white">Probate Help</Link>
                <Link href="/#faq" className="text-white/80 transition hover:text-white">FAQ</Link>
                <Link href="/contact" className="text-white/80 transition hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Contact</p>
              <div className="mt-2 space-y-1 text-sm">
                <a href="tel:559-991-2190" className="block text-white/80 transition hover:text-white">559-991-2190</a>
                <Link href="/get-offer" className="block text-white/80 transition hover:text-white">
                  Get your cash offer
                </Link>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-12 text-xs text-white/50">
          © {new Date().getFullYear()} Next Level Home Solutions · <Link href="/terms-conditions" className="hover:text-white/70">Terms</Link> · <Link href="/privacy-policy" className="hover:text-white/70">Privacy</Link>
        </p>
      </div>
    </footer>
  );
}
