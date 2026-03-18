import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import FAQ from '@/components/FAQ';
import Testimonials from '@/components/Testimonials';
import Videos from '@/components/Videos';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src="https://monteinvestment.com/wp-content/uploads/2025/01/White-Home.png"
            alt="Beautiful family home - sell fast with Next Level Home Solutions in Fresno, CA"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-end px-5 pb-20 pt-28 sm:pb-24 sm:pt-36">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-[#c9a86c] sm:text-base">Facing foreclosure? You still have options.</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.1] text-white sm:text-6xl md:text-7xl lg:text-8xl" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}>
            Sell your home fast.
            <br />
            <span className="text-[#c9a86c]">Before the bank takes it.</span>
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-relaxed text-white/95 sm:text-2xl" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.5)' }}>
            Cash offers. Sell as-is. No commissions. Close in as little as 7 days. Don&apos;t wait—we&apos;re here to help.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="tel:559-991-2190"
              className="inline-flex items-baseline gap-2 border-b-2 border-white pb-1 font-body text-lg sm:text-xl font-medium tracking-wide tabular-nums text-white transition hover:border-[#c9a86c] min-h-[44px]"
            >
              <span className="text-xl sm:text-2xl">☎</span>
              559-991-2190
            </a>
            <Link
              href="/get-offer"
              className="inline-flex items-center gap-2 bg-white px-6 py-3 font-body text-base font-semibold uppercase tracking-widest text-black transition hover:bg-[#c9a86c] hover:text-white min-h-[44px]"
            >
              Get offer
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Form + about — side by side on desktop */}
      <section id="offer" className="border-t-2 border-black/10 bg-black/5">
        <div className="mx-auto max-w-5xl px-5 py-16 md:py-24">
          <div className="grid gap-16 lg:grid-cols-5 lg:gap-20">
            <div className="lg:col-span-2">
              <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04]">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1e2d3d] via-[#8b7355] to-[#1e2d3d]" />
                <div className="p-8 md:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b7355]">Free, no obligation</p>
                  <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[#1e2d3d] md:text-[1.75rem]">Get your cash offer</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-warmgray/90">Same day response. No fees. No pressure.</p>
                  <div className="mt-8">
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="overflow-hidden rounded-2xl bg-[#1e2d3d] p-8 md:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a86c]">The process</p>
                <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">How it works</h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-3">
                  <div className="flex flex-col">
                    <span className="font-display text-4xl font-bold text-[#c9a86c]/40">01</span>
                    <p className="mt-3 text-sm leading-relaxed text-white/90">
                      You send address + details. We reply with a cash offer same day.
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-4xl font-bold text-[#c9a86c]/40">02</span>
                    <p className="mt-3 text-sm leading-relaxed text-white/90">
                      No appraisal, no open houses. Just a number. Take it or leave it.
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-4xl font-bold text-[#c9a86c]/40">03</span>
                    <p className="mt-3 text-sm leading-relaxed text-white/90">
                      Close in 7 days or 30. Your timeline. Cash at closing.
                    </p>
                  </div>
                </div>
                <p className="mt-8 border-t border-white/10 pt-6 text-sm text-white/70">
                  Central Valley · Las Vegas · Sonoma County. Inherited, foreclosure, relocating—we buy as-is. No repairs. No commissions. No showings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <Videos />
      <FAQ />
    </>
  );
}
