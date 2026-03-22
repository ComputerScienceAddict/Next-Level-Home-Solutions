/**
 * Match browser / IP geo to configured SEO cities and surface "popular in this area".
 */

import { SEO_CITIES, SELLER_SITUATIONS, type SeoCity, type SellerSituation } from '@/data/seo-targets';

/** When geo city isn't in our list, use a hub city per state we serve */
const STATE_HUB_SLUG: Record<string, string> = {
  CA: 'fresno-ca',
  NV: 'las-vegas-nv',
  AZ: 'phoenix-az',
  FL: 'miami-fl',
  TX: 'houston-tx',
  GA: 'atlanta-ga',
  OH: 'columbus-oh',
  AL: 'birmingham-al',
  VA: 'richmond-va',
  NY: 'new-york-ny',
  NJ: 'newark-nj',
  LA: 'new-orleans-la',
  KS: 'wichita-ks',
};

const DEFAULT_POPULAR = ['foreclosure', 'inherited-property', 'house-needs-repairs'] as const;

const US_STATE_NAME_TO_CODE: Record<string, string> = {
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
};

export function normalizeStateCode(region: string | null | undefined): string | null {
  if (!region) return null;
  const t = region.trim();
  if (t.length === 2) return t.toUpperCase();
  const code = US_STATE_NAME_TO_CODE[t.toLowerCase()];
  return code ?? null;
}

function normalizeCityName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '');
}

/** Find exact city in our list by name + state */
export function findSeoCityByGeo(cityName: string | null | undefined, stateCode: string | null | undefined): SeoCity | null {
  if (!cityName || !stateCode) return null;
  const code = stateCode.toUpperCase();
  const n = normalizeCityName(cityName);
  const hit = SEO_CITIES.find((c) => c.state === code && normalizeCityName(c.name) === n);
  return hit ?? null;
}

/** Hub city when visitor is in CA/NV/AZ but city name isn't in our list */
export function hubCityForState(stateCode: string | null | undefined): SeoCity | null {
  if (!stateCode) return null;
  const slug = STATE_HUB_SLUG[stateCode.toUpperCase()];
  if (!slug) return null;
  return SEO_CITIES.find((c) => c.slug === slug) ?? null;
}

export function isServedState(stateCode: string | null | undefined): boolean {
  if (!stateCode) return false;
  return stateCode.toUpperCase() in STATE_HUB_SLUG;
}

export type PopularSituationBrief = { slug: string; title: string; shortLabel: string };

export function popularSituationsForCity(city: SeoCity): PopularSituationBrief[] {
  const slugs = city.popularSituations?.length ? city.popularSituations : [...DEFAULT_POPULAR];
  const out: PopularSituationBrief[] = [];
  for (const slug of slugs) {
    const s = SELLER_SITUATIONS.find((x) => x.slug === slug);
    if (s) out.push({ slug: s.slug, title: s.title, shortLabel: s.shortLabel });
  }
  return out;
}

export type ResolvedLocalArea = {
  city: SeoCity;
  /** True when we used state hub because geo city wasn't in our list */
  approximate: boolean;
  /** Original geo label for UI, e.g. "Los Angeles" */
  detectedCityName?: string;
  popular: PopularSituationBrief[];
};

export function resolveLocalArea(
  geoCity: string | null | undefined,
  stateCode: string | null | undefined
): ResolvedLocalArea | null {
  const code = stateCode?.toUpperCase() ?? null;
  if (!code || !isServedState(code)) return null;

  const exact = findSeoCityByGeo(geoCity, code);
  if (exact) {
    return {
      city: exact,
      approximate: false,
      detectedCityName: geoCity ?? undefined,
      popular: popularSituationsForCity(exact),
    };
  }

  const hub = hubCityForState(code);
  if (!hub) return null;

  return {
    city: hub,
    approximate: true,
    detectedCityName: geoCity ?? undefined,
    popular: popularSituationsForCity(hub),
  };
}
