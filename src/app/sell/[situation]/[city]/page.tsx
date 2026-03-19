import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { business } from '@/config/business';
import { getAllSeoStaticParams, getCityBySlug, getSituationBySlug } from '@/data/seo-targets';
import { buildSeoPageContent } from '@/lib/seo-content';

type Props = { params: { situation: string; city: string } };

export function generateStaticParams() {
  return getAllSeoStaticParams();
}

export function generateMetadata({ params }: Props): Metadata {
  const situation = getSituationBySlug(params.situation);
  const city = getCityBySlug(params.city);
  if (!situation || !city) {
    return { title: 'Page not found' };
  }
  const content = buildSeoPageContent(situation, city);
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

export default function SellSituationCityPage({ params }: Props) {
  const situation = getSituationBySlug(params.situation);
  const city = getCityBySlug(params.city);
  if (!situation || !city) {
    notFound();
  }

  const content = buildSeoPageContent(situation, city);
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
      { '@type': 'ListItem', position: 2, name: 'Sell your house', item: `${base}/sell` },
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

      <section className="relative min-h-[38vh] bg-[#2a2520] py-16 md:py-20">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(139,115,85,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-5">
          <nav className="text-xs text-white/60">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/sell" className="hover:text-white">
              Sell your house
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{city.name}</span>
          </nav>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b7355]">
            {city.county} County · {city.state}
          </p>
          <h1 className="mt-2 font-display text-3xl text-white md:text-5xl md:leading-tight">{content.h1}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">{content.intro}</p>
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

      <section className="border-t border-black/10 py-14">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">Why homeowners in {city.name} call us</h2>
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
              <div className="rounded-xl border border-black/10 bg-[#faf9f7] p-6">
                <h2 className="font-display text-lg font-semibold text-[#1e2d3d]">ZIP codes & neighborhoods</h2>
                <p className="mt-3 text-sm leading-relaxed text-warmgray">{content.zipSection}</p>
              </div>
            </div>
            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border-2 border-[#8b7355]/25 bg-white p-6 shadow-lg">
                <p className="font-display text-lg font-semibold text-[#1e2d3d]">Free, no-obligation offer</p>
                <p className="mt-2 text-sm text-warmgray">{content.cta}</p>
                <a href={business.phoneTel} className="btn-premium mt-6 block w-full text-center">
                  {business.phone}
                </a>
                <Link href="/contact" className="mt-3 block text-center text-sm font-medium text-[#8b7355] hover:underline">
                  Or send a message
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#f8f7f5] py-14">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-display text-2xl font-semibold text-[#1e2d3d]">Questions</h2>
          <div className="mt-8 space-y-6">
            {content.faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-black/10 bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-[#1e2d3d]">{f.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-warmgray">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <p className="text-sm text-warmgray">
            Related:{' '}
            <Link href="/how-we-work" className="font-medium text-[#8b7355] hover:underline">
              How we work
            </Link>
            {' · '}
            <Link href="/probate-help" className="font-medium text-[#8b7355] hover:underline">
              Probate help
            </Link>
            {' · '}
            <Link href="/sell" className="font-medium text-[#8b7355] hover:underline">
              All seller situations
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
