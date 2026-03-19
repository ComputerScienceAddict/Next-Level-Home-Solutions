import Link from 'next/link';
import { business } from '@/config/business';
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
      <section className="relative min-h-[36vh] bg-[#2a2520] py-16 md:py-20">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(139,115,85,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b7355]">Motivated sellers</p>
          <h1 className="mt-2 font-display text-4xl text-white md:text-5xl">Sell your house — by situation & city</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">
            We built these pages around real seller situations and the cities we buy in—so you get relevant answers, not
            generic fluff. Pick what matches you, then call for a confidential offer.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href={business.phoneTel} className="btn-premium inline-block">
              Call {business.phone}
            </a>
            <Link href="/get-offer" className="inline-flex items-center rounded-lg border-2 border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Get a cash offer
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">Seller situations we target</h2>
          <p className="mt-3 max-w-3xl text-warmgray">
            Each link opens a dedicated page with local ZIP context and FAQs for that situation.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SELLER_SITUATIONS.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/sell/${s.slug}/fresno-ca`}
                  className="block rounded-xl border border-black/10 bg-white p-5 shadow-sm transition hover:border-[#8b7355]/40 hover:shadow-md"
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
