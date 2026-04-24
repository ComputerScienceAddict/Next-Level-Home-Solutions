import Image from 'next/image';
import Link from 'next/link';
import { SITE_HOUSES_BACKGROUND_URL } from '@/config/site-assets';
import ContactForm from '@/components/ContactForm';
import FAQ from '@/components/FAQ';

const testimonials = [
  { 
    quote: "I don't know where to start when it came to selling my home. With falling behind on property taxes and my home needing some work, I came across Eric. He gave me the best cash offer for my home and he is very quick and very professional to work with. We closed in 2 weeks and everything went smoothly. I would highly recommend him!", 
    author: 'Brandy',
    rating: 5,
    location: 'Fresno, CA'
  },
  { 
    quote: 'I had a great experience with smooth communication throughout the process. It was quick, easy, and hassle-free. I highly recommend it.', 
    author: 'Ignacio N. Zaragoza',
    rating: 5,
    location: 'Clovis, CA'
  },
  { 
    quote: "Next Level Home Solutions came through during a tough time. I had a vacant property and wanted to sell fast. Fair cash price, no hidden fees, no lengthy paperwork. The real deal!", 
    author: 'Mark L.',
    rating: 5,
    location: 'Madera, CA'
  },
];

const stats = [
  { value: '500+', label: 'Homes Purchased' },
  { value: '24hr', label: 'Average Response' },
  { value: '7-14', label: 'Days to Close' },
  { value: '$0', label: 'Hidden Fees' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-gold-300' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[min(100dvh,820px)] sm:min-h-[75vh]">
        <div className="absolute inset-0">
          <Image
            src={SITE_HOUSES_BACKGROUND_URL}
            alt="Beautiful family home - sell fast with Next Level Home Solutions"
            fill
            className="object-cover object-[center_35%] sm:object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/55 sm:bg-gradient-to-br sm:from-black/85 sm:via-black/65 sm:to-black/50" />
        </div>
        <div className="relative mx-auto flex min-h-[min(100dvh,820px)] max-w-6xl flex-col justify-end px-4 pb-[max(5rem,env(safe-area-inset-bottom,0px))] pt-24 sm:min-h-[75vh] sm:px-6 sm:pb-28 sm:pt-36">
          {/* Trust badges */}
          <div className="mb-6 flex flex-wrap gap-3 sm:mb-8">
            <span className="trust-badge animate-fade-in">
              <svg className="h-4 w-4 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Licensed & Insured
            </span>
            <span className="trust-badge animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <svg className="h-4 w-4 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              4.9/5 Rating
            </span>
            <span className="trust-badge animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <svg className="h-4 w-4 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
              </svg>
              24hr Response
            </span>
          </div>

          <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-300 sm:text-sm sm:tracking-[0.3em] md:text-base animate-fade-in">
            Facing foreclosure? You still have options.
          </p>
          <h1
            className="mt-3 font-display text-[2.25rem] leading-[1.06] text-white sm:mt-4 sm:text-5xl sm:leading-[1.08] md:text-6xl lg:text-7xl xl:text-[5.5rem] animate-fade-in-up"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.7), 0 2px 10px rgba(0,0,0,0.5)', animationDelay: '0.1s' }}
          >
            Sell your home fast.
            <br />
            <span className="text-gradient-gold inline-block" style={{ WebkitTextStroke: '1px rgba(201, 168, 108, 0.3)' }}>
              Before the bank takes it.
            </span>
          </h1>
          <p
            className="mt-6 max-w-2xl text-[1.075rem] leading-relaxed text-white/95 sm:mt-8 sm:text-2xl animate-fade-in-up"
            style={{ textShadow: '0 2px 15px rgba(0,0,0,0.6)', animationDelay: '0.2s' }}
          >
            Get a <strong className="font-semibold text-gold-200">fair cash offer in 24 hours</strong>. Sell as-is. No commissions. Close in as little as 7 days.
          </p>
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <a
              href="tel:559-991-2190"
              className="group touch-manipulation inline-flex min-h-[56px] items-center justify-center gap-2.5 rounded-xl border-2 border-white/30 bg-white/15 px-6 py-3.5 font-body text-base font-semibold tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:border-gold-300 hover:bg-white/25 hover:shadow-glow-gold sm:inline-flex sm:justify-start sm:border-0 sm:border-b-2 sm:border-transparent sm:bg-transparent sm:pb-1 sm:pl-0 sm:pr-0 sm:pt-0 sm:text-lg md:text-xl"
            >
              <span className="text-xl transition-transform group-hover:scale-110 sm:text-2xl md:text-3xl" aria-hidden>
                ☎
              </span>
              <span className="tabular-nums">559-991-2190</span>
            </a>
            <Link
              href="/get-offer"
              className="btn-gold touch-manipulation min-h-[56px] shadow-glow-gold-lg sm:bg-white sm:text-black sm:hover:bg-gold-300 sm:hover:text-navy-600 sm:hover:shadow-glow-gold"
            >
              Get Cash Offer
              <span className="text-lg" aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-gold-300/20 bg-gradient-to-b from-navy-700 to-navy-600 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="font-display text-4xl font-bold text-gold-300 sm:text-5xl md:text-6xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-medium text-white/70 sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Foreclosure help */}
      <section className="border-t border-gold-300/15 bg-gradient-to-b from-navy-600 via-[#1a2838] to-navy-700">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="animate-fade-in-up">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-300">
                Foreclosure help
              </p>
              <h2 className="mt-3 font-display text-[2rem] leading-[1.1] text-white sm:text-4xl md:text-[2.75rem]">
                Behind on payments?
                <br />
                <span className="text-gradient-gold">You still have options.</span>
              </h2>
              <p className="mt-6 text-[15.5px] leading-relaxed text-white/85 sm:text-[17px]">
                If you&apos;ve received a notice of default or are falling behind on your mortgage, the
                situation can feel overwhelming. But foreclosure is <strong className="font-semibold text-white">not</strong> your
                only path. Many homeowners don&apos;t realize they can sell their home for cash
                &mdash; even at this stage &mdash; and walk away with money in their pocket instead
                of a foreclosure on their record.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href="tel:559-991-2190"
                  className="btn-gold touch-manipulation min-h-[54px]"
                >
                  <span aria-hidden>☎</span> Call 559-991-2190
                </a>
                <Link
                  href="/foreclosure-options"
                  className="touch-manipulation inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl border-2 border-gold-300/40 bg-white/5 px-6 py-3.5 text-[15px] font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-gold-300 hover:bg-white/10 hover:shadow-glow-gold active:scale-[0.99]"
                >
                  See all my options
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-5 sm:gap-6">
              <div className="card-glass group p-6 sm:p-7 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-300/15 text-gold-300 ring-1 ring-gold-300/20 transition-all group-hover:scale-110 group-hover:bg-gold-300/25">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gold-300">What is foreclosure?</p>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/80">
                      Foreclosure is when the bank takes your home because mortgage payments have
                      fallen behind. Once the process starts, the timeline can move fast.
                      But selling before the bank forecloses lets you control the outcome.
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-glass group p-6 sm:p-7 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-300/15 text-gold-300 ring-1 ring-gold-300/20 transition-all group-hover:scale-110 group-hover:bg-gold-300/25">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gold-300">Can I still sell my home?</p>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/80">
                      <strong className="font-semibold text-white">Yes.</strong> In most cases you can sell your home
                      right up until the auction date. A cash buyer like us can close quickly &mdash; often in
                      7 to 14 days &mdash; so you can pay off the loan and keep any remaining equity.
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-glass group p-6 sm:p-7 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-300/15 text-gold-300 ring-1 ring-gold-300/20 transition-all group-hover:scale-110 group-hover:bg-gold-300/25">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gold-300">What does it cost me?</p>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/80">
                      <strong className="font-semibold text-white">Nothing upfront.</strong> We buy homes as-is &mdash; no
                      repairs, no realtor commissions, no listing fees. You get a cash offer with no
                      obligation. If it works for you, we close. If not, no hard feelings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Situation cards */}
          <div className="mt-16 border-t border-white/10 pt-12 sm:mt-20 sm:pt-14">
            <p className="text-center text-xs font-bold uppercase tracking-[0.28em] text-gold-300/90">
              We also help with
            </p>
            <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
              <Link
                href="/probate-help"
                className="card-glass group touch-manipulation flex min-h-[72px] flex-col items-center justify-center rounded-xl p-4 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] sm:min-h-[80px]"
              >
                <svg className="h-6 w-6 text-gold-300 transition-transform group-hover:scale-110 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="mt-2 text-sm font-semibold text-white">Inherited property</span>
                <span className="mt-0.5 text-[11px] text-white/60">Probate &amp; estate sales</span>
              </Link>
              <Link
                href="/areas?situation=divorce"
                className="card-glass group touch-manipulation flex min-h-[72px] flex-col items-center justify-center rounded-xl p-4 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] sm:min-h-[80px]"
              >
                <svg className="h-6 w-6 text-gold-300 transition-transform group-hover:scale-110 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="mt-2 text-sm font-semibold text-white">Divorce</span>
                <span className="mt-0.5 text-[11px] text-white/60">Split &amp; move forward</span>
              </Link>
              <Link
                href="/areas?situation=house-needs-repairs"
                className="card-glass group touch-manipulation flex min-h-[72px] flex-col items-center justify-center rounded-xl p-4 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] sm:min-h-[80px]"
              >
                <svg className="h-6 w-6 text-gold-300 transition-transform group-hover:scale-110 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span className="mt-2 text-sm font-semibold text-white">Needs repairs</span>
                <span className="mt-0.5 text-[11px] text-white/60">We buy as-is</span>
              </Link>
              <Link
                href="/areas?situation=bad-tenants-rental"
                className="card-glass group touch-manipulation flex min-h-[72px] flex-col items-center justify-center rounded-xl p-4 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] sm:min-h-[80px]"
              >
                <svg className="h-6 w-6 text-gold-300 transition-transform group-hover:scale-110 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
                <span className="mt-2 text-sm font-semibold text-white">Bad tenants</span>
                <span className="mt-0.5 text-[11px] text-white/60">Tired landlord? We buy it</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Form + How it works */}
      <section id="offer" className="section-divider border-t-2 bg-gradient-to-b from-white/95 to-offwhite/95">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:py-28">
          <div className="grid gap-16 lg:grid-cols-5 lg:gap-24">
            <div className="lg:col-span-2">
              <div className="card-premium group relative overflow-hidden animate-scale-in">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-premium" />
                <div className="absolute inset-0 bg-shimmer opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundSize: '1000px 100%' }} />
                <div className="relative p-7 sm:p-9 md:p-11">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/10 px-3 py-1.5 ring-1 ring-gold-400/20">
                    <svg className="h-4 w-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Free, no obligation</span>
                  </div>
                  <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-navy-600 md:text-[2rem]">
                    Get your cash offer
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-warmgray">
                    Same day response. No fees. No pressure. Just a fair offer.
                  </p>
                  <div className="mt-8">
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="overflow-hidden rounded-2xl bg-gradient-premium p-7 shadow-premium-lg sm:p-9 md:p-11 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm ring-1 ring-white/20">
                  <svg className="h-4 w-4 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">The process</span>
                </div>
                <h2 className="mt-4 font-display text-3xl text-white md:text-[2.5rem]">How it works</h2>
                <div className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
                  <div className="group flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-5xl font-bold text-gold-300/30 transition-all group-hover:text-gold-300/50 group-hover:scale-110">01</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>
                    <p className="mt-4 text-[15px] leading-relaxed text-white/90">
                      You send address + details. We reply with a <strong className="font-semibold text-white">cash offer same day</strong>.
                    </p>
                  </div>
                  <div className="group flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-5xl font-bold text-gold-300/30 transition-all group-hover:text-gold-300/50 group-hover:scale-110">02</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>
                    <p className="mt-4 text-[15px] leading-relaxed text-white/90">
                      No appraisal, no open houses. Just a <strong className="font-semibold text-white">fair number</strong>. Take it or leave it.
                    </p>
                  </div>
                  <div className="group flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-5xl font-bold text-gold-300/30 transition-all group-hover:text-gold-300/50 group-hover:scale-110">03</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>
                    <p className="mt-4 text-[15px] leading-relaxed text-white/90">
                      Close in <strong className="font-semibold text-white">7 days or 30</strong>. Your timeline. Cash at closing.
                    </p>
                  </div>
                </div>
                <div className="mt-10 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <svg className="h-5 w-5 shrink-0 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm leading-relaxed text-white/80">
                    We buy as-is across <strong className="font-semibold text-white">14 states</strong>. No repairs. No commissions. No showings. Just a fast, fair cash sale on your terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-black/10 bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-400/10 px-4 py-2 ring-1 ring-gold-400/20">
              <svg className="h-4 w-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">Testimonials</span>
            </div>
            <h2 className="mt-4 font-display text-3xl text-black sm:text-4xl">What homeowners say</h2>
            <p className="mt-3 text-base text-gray-600">Real stories from real people we&apos;ve helped</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3 sm:gap-6">
            {testimonials.map((t, i) => (
              <figure
                key={i}
                className="card-premium group flex flex-col p-6 sm:p-7 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <StarRating rating={t.rating} />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-gray-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-premium text-sm font-bold text-white shadow-md">
                    {t.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <figcaption className="font-semibold text-navy-600">{t.author}</figcaption>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
              </figure>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/get-offer"
              className="btn-premium inline-flex items-center gap-2"
            >
              Get your offer today
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <FAQ />
    </>
  );
}
