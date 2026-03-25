import Link from 'next/link';
import { business } from '@/config/business';
import { SITE_HOUSES_BACKGROUND_URL } from '@/config/site-assets';
import { SEO_CITIES, SELLER_SITUATIONS } from '@/data/seo-targets';

export const metadata = {
  title: `Sell Your House Fast — By City & Situation | ${business.name}`,
  description: `${business.name} buys houses as-is across ${business.primaryMarket}. Foreclosure, divorce, inherited homes, bad tenants, repairs, vacant—find your city and situation.`,
  openGraph: {
    title: 'Sell your house — Motivated seller help by area',
    description: 'Targeted help for foreclosure, divorce, inheritance, rentals, repairs, and vacant homes.',
  },
};

export default function SellHubPage() {
  return (
    <>
      <section className="relative min-h-[min(42vh,440px)] overflow-hidden px-1 py-12 sm:min-h-[min(48vh,520px)] sm:px-0 sm:py-16 md:min-h-[min(52vh,580px)] md:py-24">
        <div
          className="pointer-events-none absolute inset-0 scale-105 bg-cover bg-[center_28%]"
          style={{ backgroundImage: `url("${SITE_HOUSES_BACKGROUND_URL}")` }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1a1612]/93 via-[#2a2520]/91 to-[#1e2d3d]/94"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(201,168,108,0.14) 1px, transparent 0)',
            backgroundSize: '26px 26px',
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-white sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8d4a8] sm:text-xs sm:tracking-[0.25em]">
            Motivated sellers
          </p>
          <h1 className="mt-2 max-w-4xl font-display text-[1.65rem] leading-[1.15] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)] sm:text-4xl sm:leading-tight md:text-5xl">
            Sell your house — by situation & city
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-100 sm:mt-6 sm:text-lg">
            Browse all situations and cities, or{' '}
            <Link href="/areas" className="font-medium text-white underline decoration-white/40 underline-offset-2 transition hover:decoration-white">
              use the Areas picker
            </Link>{' '}
            to find your specialized page.
          </p>
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href={business.phoneTel}
              className="btn-premium touch-manipulation flex min-h-[48px] w-full items-center justify-center shadow-lg shadow-black/25 sm:inline-flex sm:w-auto"
            >
              Call {business.phone}
            </a>
            <Link
              href="/get-offer"
              className="touch-manipulation flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 border-white/40 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/55 hover:bg-white/15 active:scale-[0.99] sm:w-auto"
            >
              Get a cash offer
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#f6f4f0] to-white py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">Seller situations we target</h2>
          <p className="mt-3 max-w-3xl text-warmgray">
            Each link opens a dedicated page with local ZIP context and FAQs for that situation.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SELLER_SITUATIONS.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/sell/${s.slug}/fresno-ca`}
                  className="touch-manipulation block min-h-[52px] rounded-xl border border-black/10 bg-white p-5 shadow-sm transition hover:border-[#8b7355]/40 hover:shadow-md active:scale-[0.99]"
                >
                  <span className="font-display text-lg font-semibold text-[#1e2d3d]">{s.title}</span>
                  <p className="mt-2 text-sm text-warmgray line-clamp-2">{s.painSummary}</p>
                  <span className="mt-3 inline-block text-sm font-medium text-[#8b7355]">View in Fresno →</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-warmgray">
            Tip: Use the city list below to open the same situation in your town.
          </p>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#faf9f7] py-14">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">Cities & ZIPs we market to</h2>
          <p className="mt-3 text-warmgray">
            Expandable list—each city links to all situation pages. Representative ZIP codes are shown for local SEO.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SEO_CITIES.map((city) => (
              <div key={city.slug} className="rounded-xl border border-black/10 bg-white p-5">
                <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">
                  {city.name}, {city.state}
                </h3>
                <p className="text-xs uppercase tracking-wider text-warmgray">{city.county} County</p>
                <p className="mt-2 text-sm text-warmgray">
                  <span className="font-medium text-[#1e2d3d]">ZIPs:</span> {city.zips.join(', ')}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SELLER_SITUATIONS.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/sell/${s.slug}/${city.slug}`}
                      className="rounded-md bg-[#f0ebe4] px-2 py-1 text-xs font-medium text-[#1e2d3d] hover:bg-[#8b7355]/20"
                    >
                      {s.shortLabel}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
