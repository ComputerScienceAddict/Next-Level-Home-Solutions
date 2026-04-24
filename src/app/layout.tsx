import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Script from 'next/script';
import { Instrument_Serif, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { business } from '@/config/business';
import { SITE_HOUSES_BACKGROUND_URL, SITE_OG_IMAGE_PATH } from '@/config/site-assets';

const instrument = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const plex = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const ogDescription =
  'Get a fair cash offer in 24 hours. We buy houses as-is across California. No commissions, no repairs, no showings. Facing foreclosure? We can help you sell fast and keep your equity. Trusted local home buyers since [year].';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nextlevelhomesolutions.com'),
  title: {
    default: `Sell Your House Fast for Cash | ${business.name}`,
    template: `%s | ${business.name}`,
  },
  description: ogDescription,
  keywords: [
    'sell house fast',
    'cash home buyers',
    'we buy houses',
    'foreclosure help',
    'sell as-is',
    'Fresno home buyers',
    'avoid foreclosure',
    'sell house for cash',
    'cash offer for house',
    'sell inherited property',
    'probate real estate',
    'divorce house sale',
    'fast home sale California',
  ],
  authors: [{ name: business.name }],
  creator: business.name,
  publisher: business.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: business.name,
    title: 'Sell Your House Fast for Cash in California',
    description: ogDescription,
    images: [
      {
        url: SITE_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: `${business.name} — Fast, Fair Cash Offers for Your Home`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sell Your House Fast for Cash',
    description: ogDescription,
    images: [SITE_OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover' as const,
  themeColor: '#1e2d3d',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': process.env.NEXT_PUBLIC_SITE_URL || 'https://nextlevelhomesolutions.com',
    name: 'Next Level Home Solutions',
    description: 'Professional cash home buyers in California. We buy homes fast for cash, help homeowners facing foreclosure sell quickly with no commissions. Get your offer in 24 hours.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nextlevelhomesolutions.com',
    telephone: '559-991-2190',
    email: business.contactEmail,
    priceRange: '$$',
    image: SITE_OG_IMAGE_PATH,
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nextlevelhomesolutions.com'}/logo.png`,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fresno',
      addressRegion: 'CA',
      postalCode: '93650',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '36.7378',
      longitude: '-119.7871',
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Fresno',
      },
      {
        '@type': 'State',
        name: 'California',
      },
    ],
    openingHours: 'Mo-Fr 08:00-18:00',
    sameAs: [
      // Add social media profiles here if available
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
    offers: {
      '@type': 'Offer',
      description: 'Cash offers for homes in any condition. Close in as little as 7 days.',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <html lang="en" className={`${instrument.variable} ${plex.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="site-body-bg font-body antialiased"
        style={
          {
            ['--site-houses-bg']: `url("${SITE_HOUSES_BACKGROUND_URL}")`,
          } as CSSProperties
        }
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18044630783"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-ads-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18044630783');`,
          }}
        />
        <Header />
        <main className="min-h-0 overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
