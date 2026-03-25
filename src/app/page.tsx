import Image from 'next/image';
import Link from 'next/link';
import LocalForYouHome from '@/components/LocalForYouHome';
import { SITE_HOUSES_BACKGROUND_URL } from '@/config/site-assets';
import ContactForm from '@/components/ContactForm';
import FAQ from '@/components/FAQ';
import Testimonials from '@/components/Testimonials';
import Videos from '@/components/Videos';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[min(100dvh,820px)] sm:min-h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src={SITE_HOUSES_BACKGROUND_URL}
            alt="Beautiful family home - sell fast with Next Level Home Solutions in Fresno, CA"
            fill
            className="object-cover object-[center_35%] sm:object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/65 to-black/50 sm:bg-black/70" />
        </div>
        <div className="relative mx-auto flex min-h-[min(100dvh,820px)] max-w-5xl flex-col justify-end px-4 pb-[max(5rem,env(safe-area-inset-bottom,0px))] pt-24 sm:min-h-[70vh] sm:px-5 sm:pb-24 sm:pt-36">
          <p className="font-display text-xs uppercase tracking-[0.28em] text-[#c9a86c] sm:text-sm sm:tracking-[0.3em] md:text-base">
            Facing foreclosure? You still have options.
          </p>
          <h1
            className="mt-3 font-display text-[2.125rem] leading-[1.08] text-white sm:mt-4 sm:text-5xl sm:leading-[1.1] md:text-6xl lg:text-7xl xl:text-8xl"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}
          >
            Sell your home fast.
            <br />
            <span className="text-[#c9a86c]">Before the bank takes it.</span>
          </h1>
          <p
            className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/95 sm:mt-8 sm:text-2xl"
            style={{ textShadow: '0 2px 15px rgba(0,0,0,0.5)' }}
          >
            Cash offers. Sell as-is. No commissions. Close in as little as 7 days. Don&apos;t wait—we&apos;re here to help.
          </p>
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="tel:559-991-2190"
              className="touch-manipulation inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-5 py-3 font-body text-base font-semibold tracking-wide tabular-nums text-white backdrop-blur-sm transition hover:border-[#c9a86c] hover:bg-white/15 sm:inline-flex sm:justify-start sm:border-0 sm:border-b-2 sm:border-transparent sm:bg-transparent sm:pb-1 sm:pl-0 sm:pr-0 sm:pt-0 sm:text-lg md:text-xl"
            >
              <span className="text-lg sm:text-xl md:text-2xl" aria-hidden>
                ☎
              </span>
              559-991-2190
            </a>
            <Link
              href="/get-offer"
              className="touch-manipulation inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#c9a86c] px-6 py-3.5 font-body text-[15px] font-bold uppercase tracking-widest text-[#1e2d3d] shadow-lg transition hover:bg-[#dfc08a] active:scale-[0.99] sm:bg-white sm:text-base sm:text-black sm:hover:bg-[#c9a86c] sm:hover:text-white"
            >
              Get offer
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <LocalForYouHome />

      {/* Form + about — side by side on desktop */}
      <section id="offer" className="border-t-2 border-black/10 bg-black/5">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-5 sm:py-16 md:py-24">
          <div className="grid gap-16 lg:grid-cols-5 lg:gap-20">
            <div className="lg:col-span-2">
              <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04]">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1e2d3d] via-[#8b7355] to-[#1e2d3d]" />
                <div className="p-6 sm:p-8 md:p-10">
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
              <div className="overflow-hidden rounded-2xl bg-[#1e2d3d] p-6 sm:p-8 md:p-10">
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
                  14 states: FL · TX · GA · OH · AL · VA · NY · NJ · AZ · LA · KS · NV · CA. Inherited, foreclosure, relocating—we buy as-is. No repairs. No commissions. No showings.
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
