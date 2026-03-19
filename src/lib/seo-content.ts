import { business } from '@/config/business';
import type { SeoCity, SellerSituation } from '@/data/seo-targets';

export type SeoPageContent = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  localAngle: string;
  bullets: string[];
  zipSection: string;
  faqs: { q: string; a: string }[];
  cta: string;
};

/**
 * Builds unique, human-readable SEO copy per city + situation (no duplicate thin pages).
 * Optional: layer OpenAI drafts in admin later—this ships fast, indexable, and offline-safe.
 */
export function buildSeoPageContent(situation: SellerSituation, city: SeoCity): SeoPageContent {
  const cityState = `${city.name}, ${city.state}`;
  const zipList = city.zips.slice(0, 5).join(', ');
  const zipSuffix = city.zips.length > 5 ? ` and nearby areas` : '';

  const title = `Sell Your House in ${cityState} — ${situation.shortLabel} | ${business.name}`;
  const description = `${situation.shortLabel} in ${city.name}? ${business.name} buys houses as-is in ${city.county} County and ${zipList}${zipSuffix}. Cash offer, no commissions. Call ${business.phone}.`;

  const h1 = `${situation.title} in ${city.name}? We Buy Houses As-Is`;

  const intro = `${situation.painSummary} Homeowners in ${cityState} trust ${business.name} when they need a straightforward sale without fixing the house or waiting months on the market.`;

  const localAngle = `We actively buy properties in ${city.name} and surrounding ${city.county} County neighborhoods. Whether you are near ${city.zips[0] || 'the city center'} or elsewhere in the area, we can walk you through a simple process: tell us about the home, receive a fair cash offer with no obligation, and choose a closing date that works for you.`;

  const bullets = [
    ...situation.howWeHelp.map((line) => line),
    ...business.valueProps.slice(0, 3),
  ];

  const zipSection = `We buy homes across ${city.name} and nearby ZIP codes including ${zipList}. If your property is close to these areas, reach out—we often add new neighborhoods as we grow.`;

  const faqs: { q: string; a: string }[] = [
    {
      q: `Do you buy ${situation.shortLabel.toLowerCase()} situations in ${city.name}?`,
      a: `Yes. We work with sellers in ${cityState} dealing with ${situation.searchTerms[0] || 'similar challenges'}. Every situation is different—we listen first, then explain how a cash sale could work.`,
    },
    {
      q: `What areas near ${city.name} do you cover?`,
      a: `We buy in ${city.county} County and the broader ${business.primaryMarket} region. Representative ZIP codes we market to include ${zipList}.`,
    },
    {
      q: 'Are there fees or commissions?',
      a: `We are direct buyers—no listing agent commissions when you sell to us. We will explain any costs upfront so you can compare your options.`,
    },
    {
      q: 'How fast can we close?',
      a: `Timelines vary by title and situation, but many sellers move quickly when needed. Ask about your timeline when you call ${business.phone}.`,
    },
  ];

  const cta = `Call or text ${business.phone} for a confidential conversation about your ${city.name} property.`;

  return {
    title,
    description,
    h1,
    intro,
    localAngle,
    bullets,
    zipSection,
    faqs,
    cta,
  };
}
