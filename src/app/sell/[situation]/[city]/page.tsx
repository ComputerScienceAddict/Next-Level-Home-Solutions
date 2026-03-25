import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { business } from '@/config/business';
import { SITE_HOUSES_BACKGROUND_URL } from '@/config/site-assets';
import { getAllSeoStaticParams, getCityBySlug, getSituationBySlug } from '@/data/seo-targets';
import SellLocalMatchBanner from '@/components/SellLocalMatchBanner';
import SellMobileStickyCta from '@/components/SellMobileStickyCta';
import { popularSituationsForCity } from '@/lib/geo-match';
import { loadSeoContent } from '@/lib/seo-content-loader';

type Props = { params: { situation: string; city: string } };

/** Re-fetch Supabase AI content periodically without full rebuild */
export const revalidate = 120;

export function generateStaticParams() {
  return getAllSeoStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const situation = getSituationBySlug(params.situation);
  const city = getCityBySlug(params.city);
  if (!situation || !city) {
    return { title: 'Page not found' };
  }
  const { content } = await loadSeoContent(situation, city);
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://nextlevelhomesolutions.com';
  const url = `${base}/sell/${params.situation}/${params.city}`;
  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: url },
    openGraph: {
      title: content.title,
      description: content.description,
      url,
      siteName: business.name,
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function SellSituationCityPage({ params }: Props) {
  const situation = getSituationBySlug(params.situation);
  const city = getCityBySlug(params.city);
  if (!situation || !city) {
    notFound();
  }

  const { content, source } = await loadSeoContent(situation, city);
  const popularHere = popularSituationsForCity(city).filter((p) => p.slug !== situation.slug);
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://nextlevelhomesolutions.com';
  const pageUrl = `${base}/sell/${params.situation}/${params.city}`;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Areas', item: `${base}/areas` },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${situation.shortLabel} — ${city.name}`,
        item: pageUrl,
      },
    ],
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${business.name} — ${situation.shortLabel} in ${city.name}`,
    provider: { '@type': 'LocalBusiness', name: business.name, telephone: business.phone },
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: { '@type': 'AdministrativeArea', name: `${city.county} County` },
    },
    description: content.description,
    url: pageUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <section className="relative min-h-[min(46vh,420px)] overflow-hidden px-1 py-12 sm:min-h-[min(52vh,560px)] sm:px-0 sm:py-16 md:min-h-[min(58vh,640px)] md:py-24">
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
          <SellLocalMatchBanner pageCitySlug={city.slug} />
          <nav className="flex flex-wrap items-center gap-x-1 text-[11px] text-white/75 sm:text-xs">
            <Link href="/" className="text-white/75 underline-offset-2 transition hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-white/50">/</span>
            <Link href="/areas" className="text-white/75 underline-offset-2 transition hover:text-white">
              Areas
            </Link>
            <span className="mx-2 text-white/50">/</span>
            <span className="font-medium text-white">{city.name}</span>
          </nav>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#e8d4a8]">
            {city.county} County · {city.state}
            {source === 'ai' && (
              <span className="ml-2 rounded bg-white/15 px-2 py-0.5 text-[10px] font-normal normal-case tracking-normal text-white">
                AI-enhanced
              </span>
            )}
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-[1.65rem] leading-[1.15] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)] sm:text-3xl sm:leading-tight md:text-5xl md:leading-[1.12]">
            {content.h1}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-100 sm:mt-6 sm:text-lg">{content.intro}</p>
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href={business.phoneTel}
              className="btn-premium touch-manipulation flex min-h-[48px] w-full items-center justify-center shadow-lg shadow-black/25 sm:w-auto sm:px-8"
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

      <section className="border-t border-black/10 bg-gradient-to-b from-[#f6f4f0] to-white py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          {popularHere.length > 0 && (
            <div className="mb-8 rounded-2xl border border-[#c9a86c]/25 bg-white/90 p-5 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 backdrop-blur-sm sm:mb-10 sm:p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7355]">Popular in {city.name}</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-[#1e2d3d]">Other situations homeowners here often search</h2>
              <p className="mt-2 text-sm text-warmgray">
                Based on your area—we surface what people near you ask about most. Open a page built for that situation in {city.name}.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {popularHere.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/sell/${p.slug}/${city.slug}`}
                      className="touch-manipulation inline-flex min-h-[44px] items-center rounded-xl border border-[#8b7355]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#1e2d3d] transition hover:border-[#8b7355] hover:bg-[#8b7355]/5 active:scale-[0.99]"
                    >
                      {p.shortLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
            <div className="order-2 space-y-8 lg:order-1 lg:col-span-2">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#1e2d3d] sm:text-2xl">
                  Why homeowners in {city.name} call us
                </h2>
                <p className="mt-4 text-warmgray leading-relaxed">{content.localAngle}</p>
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-[#1e2d3d]">How we help</h2>
                <ul className="mt-4 space-y-3">
                  {content.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-warmgray">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8b7355]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-black/10 bg-[#faf9f7] p-5 sm:p-6">
                <h2 className="font-display text-lg font-semibold text-[#1e2d3d]">ZIP codes & neighborhoods</h2>
                <p className="mt-3 text-sm leading-relaxed text-warmgray">{content.zipSection}</p>
              </div>
            </div>
            <aside className="order-1 lg:order-2 lg:col-span-1">
              <div className="rounded-2xl border-2 border-[#8b7355]/25 bg-white p-5 shadow-lg sm:p-6 lg:sticky lg:top-24">
                <p className="font-display text-lg font-semibold text-[#1e2d3d]">Free, no-obligation offer</p>
                <p className="mt-2 text-sm leading-relaxed text-warmgray">{content.cta}</p>
                <a
                  href={business.phoneTel}
                  className="btn-premium touch-manipulation mt-5 flex min-h-[48px] w-full items-center justify-center text-center sm:mt-6"
                >
                  {business.phone}
                </a>
                <Link
                  href="/contact"
                  className="mt-3 block min-h-[44px] py-2 text-center text-sm font-medium text-[#8b7355] hover:underline"
                >
                  Or send a message
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#f8f7f5] py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
          <h2 className="font-display text-xl font-semibold text-[#1e2d3d] sm:text-2xl">Questions</h2>
          <div className="mt-8 space-y-6">
            {content.faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-black/10 bg-white p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">{f.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-warmgray">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] pt-10 lg:pb-12 lg:pt-12">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-5">
          <p className="text-center text-sm leading-loose text-warmgray">
            Related:{' '}
            <Link href="/how-we-work" className="touch-manipulation inline-flex min-h-[44px] items-center font-medium text-[#8b7355] hover:underline">
              How we work
            </Link>
            <span className="mx-1 text-black/20">·</span>
            <Link href="/probate-help" className="touch-manipulation inline-flex min-h-[44px] items-center font-medium text-[#8b7355] hover:underline">
              Probate help
            </Link>
            <span className="mx-1 text-black/20">·</span>
            <Link href="/areas" className="touch-manipulation inline-flex min-h-[44px] items-center font-medium text-[#8b7355] hover:underline">
              Areas picker
            </Link>
            <span className="mx-1 text-black/20">·</span>
            <Link href="/sell" className="touch-manipulation inline-flex min-h-[44px] items-center font-medium text-[#8b7355] hover:underline">
              All pages
            </Link>
          </p>
        </div>
      </section>

      <SellMobileStickyCta />
    </>
  );
}
