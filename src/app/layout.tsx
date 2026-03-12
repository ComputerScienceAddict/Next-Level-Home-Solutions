import type { Metadata } from 'next';
import { Instrument_Serif, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  title: 'Next Level Home Solutions | Sell Your Home Fast',
  description:
    'Facing foreclosure? We help homeowners sell quickly. Cash offers, sell as-is, no commissions. Close in as little as 7 days. Call 559-991-2190.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${instrument.variable} ${plex.variable}`}>
      <body className="font-body antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
