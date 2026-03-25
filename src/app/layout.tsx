import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { Instrument_Serif, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_HOUSES_BACKGROUND_URL } from '@/config/site-assets';

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nextlevelhomesolutions.com'),
  title: 'Next Level Home Solutions | Sell Your Home Fast',
  description:
    'Facing foreclosure? We help homeowners sell quickly. Cash offers, sell as-is, no commissions. Close in as little as 7 days. Call 559-991-2190.',
  keywords: ['sell house fast', 'cash home buyers', 'foreclosure help', 'sell as-is', 'Fresno home buyers', 'avoid foreclosure'],
  authors: [{ name: 'Next Level Home Solutions' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Next Level Home Solutions',
    title: 'Next Level Home Solutions | Sell Your Home Fast',
    description: 'Facing foreclosure? We help homeowners sell quickly. Cash offers, sell as-is, no commissions. Close in as little as 7 days.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next Level Home Solutions | Sell Your Home Fast',
    description: 'Facing foreclosure? We help homeowners sell quickly. Cash offers, sell as-is, no commissions.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
    name: 'Next Level Home Solutions',
    description: 'We buy homes fast for cash. Help homeowners facing foreclosure sell quickly with no commissions.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nextlevelhomesolutions.com',
    telephone: '559-991-2190',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fresno',
      addressRegion: 'CA',
      addressCountry: 'US',
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
        <Header />
        <main className="min-h-0 overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
