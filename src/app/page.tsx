import Image from 'next/image';
import Link from 'next/link';
import { SITE_HOUSES_BACKGROUND_URL } from '@/config/site-assets';
import ContactForm from '@/components/ContactForm';
import FAQ from '@/components/FAQ';

const testimonials = [
  { quote: "I don't know where to start when it came to selling my home. With falling behind on property taxes and my home needing some work, I came across Eric. He gave me the best cash offer for my home and he is very quick and very professional to work with. We closed in 2 weeks and everything went smoothly. I would highly recommend him!", author: 'Brandy' },
  { quote: 'I had a great experience with smooth communication throughout the process. It was quick, easy, and hassle-free. I highly recommend it.', author: 'Ignacio N. Zaragoza' },
  { quote: "Next Level Home Solutions came through during a tough time. I had a vacant property and wanted to sell fast. Fair cash price, no hidden fees, no lengthy paperwork. The real deal!", author: 'Mark L.' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[min(100dvh,820px)] sm:min-h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src={SITE_HOUSES_BACKGROUND_URL}
            alt="Beautiful family home - sell fast with Next Level Home Solutions"
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
            Cash offers. Sell as-is. No commissions. Close in as little as 7&nbsp;days.
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

      {/* Foreclosure help */}
      <section className="border-t border-[#c9a86c]/15 bg-gradient-to-b from-[#1a1612] to-[#1e2d3d]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-5 sm:py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c9a86c]">
                Foreclosure help
              </p>
              <h2 className="mt-3 font-display text-[1.75rem] leading-tight text-white sm:text-3xl md:text-4xl">
                Behind on payments?
                <br />
                <span className="text-[#c9a86c]">You still have options.</span>
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-white/80 sm:text-base">
                If you&apos;ve received a notice of default or are falling behind on your mortgage, the
                situation can feel overwhelming. But foreclosure is <strong className="text-white">not</strong> your
                only path. Many homeowners don&apos;t realize they can sell their home for cash
                &mdash; even at this stage &mdash; and walk away with money in their pocket instead
                of a foreclosure on their record.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href="tel:559-991-2190"
                  className="touch-manipulation inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#c9a86c] px-6 py-3.5 text-[15px] font-bold text-[#1e2d3d] shadow-lg transition hover:bg-[#dfc08a] active:scale-[0.99]"
                >
                  <span aria-hidden>☎</span> Call 559-991-2190
                </a>
                <Link
                  href="/foreclosure-options"
                  className="touch-manipulation inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-[#c9a86c]/40 px-6 py-3.5 text-[15px] font-semibold text-white transition hover:border-[#c9a86c] hover:bg-white/5 active:scale-[0.99]"
                >
                  See all my options →
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm sm:p-6">
                <p className="text-sm font-bold text-[#c9a86c]">What is foreclosure?</p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Foreclosure is when the bank takes your home because mortgage payments have
                  fallen behind. Once the process starts, the timeline can move fast.
                  But selling before the bank forecloses lets you control the outcome.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm sm:p-6">
                <p className="text-sm font-bold text-[#c9a86c]">Can I still sell my home?</p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  <strong className="text-white">Yes.</strong> In most cases you can sell your home
                  right up until the auction date. A cash buyer like us can close quickly &mdash; often in
                  7 to 14 days &mdash; so you can pay off the loan and keep any remaining equity.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm sm:p-6">
                <p className="text-sm font-bold text-[#c9a86c]">What does it cost me?</p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  <strong className="text-white">Nothing upfront.</strong> We buy homes as-is &mdash; no
                  repairs, no realtor commissions, no listing fees. You get a cash offer with no
                  obligation. If it works for you, we close. If not, no hard feelings.
                </p>
              </div>
            </div>
          </div>

          {/* Situation cards */}
          <div className="mt-12 border-t border-white/10 pt-10 sm:mt-16 sm:pt-12">
            <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-[#c9a86c]/80">
              We also help with
            </p>
            <div className="mx-auto mt-5 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <Link
                href="/probate-help"
                className="touch-manipulation flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center transition hover:border-[#c9a86c]/40 hover:bg-white/[0.06] active:scale-[0.98]"
              >
                <span className="text-sm font-semibold text-white">Inherited property</span>
                <span className="mt-0.5 text-[11px] text-white/50">Probate &amp; estate sales</span>
              </Link>
              <Link
                href="/areas?situation=divorce"
                className="touch-manipulation flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center transition hover:border-[#c9a86c]/40 hover:bg-white/[0.06] active:scale-[0.98]"
              >
                <span className="text-sm font-semibold text-white">Divorce</span>
                <span className="mt-0.5 text-[11px] text-white/50">Split &amp; move forward</span>
              </Link>
              <Link
                href="/areas?situation=house-needs-repairs"
                className="touch-manipulation flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center transition hover:border-[#c9a86c]/40 hover:bg-white/[0.06] active:scale-[0.98]"
              >
                <span className="text-sm font-semibold text-white">Needs repairs</span>
                <span className="mt-0.5 text-[11px] text-white/50">We buy as-is</span>
              </Link>
              <Link
                href="/areas?situation=bad-tenants-rental"
                className="touch-manipulation flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center transition hover:border-[#c9a86c]/40 hover:bg-white/[0.06] active:scale-[0.98]"
              >
                <span className="text-sm font-semibold text-white">Bad tenants</span>
                <span className="mt-0.5 text-[11px] text-white/50">Tired landlord? We buy it</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Form + How it works */}
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
                  We buy as-is across 14 states. No repairs. No commissions. No showings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — static cards */}
      <section className="border-t border-black/10 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <h2 className="font-display text-2xl text-black">What people say</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <figure
                key={i}
                className="rounded-xl border border-gray-950/[.1] bg-gray-950/[.01] p-5"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e2d3d] text-xs font-semibold text-white">
                    {t.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <figcaption className="text-sm font-medium text-black">{t.author}</figcaption>
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-gray-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <FAQ />
    </>
  );
}
