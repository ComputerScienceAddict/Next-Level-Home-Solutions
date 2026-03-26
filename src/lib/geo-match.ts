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
    .replace(/\+/g, ' ')
    .replace(/_/g, ' ')
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

const ST_ABBREV = /\bst\.?\b/g;

function normalizeForStVariant(name: string): string {
  return normalizeCityName(name).replace(ST_ABBREV, 'saint').replace(/\s+/g, ' ').trim();
}

/**
 * When IP/GPS returns a label that doesn’t exactly match our city names (+ encoding, “County”, etc.),
 * map it to an SEO city in the same state so users aren’t sent through the full picker.
 */
export function findSeoCityByGeoFuzzy(cityName: string | null | undefined, stateCode: string | null | undefined): SeoCity | null {
  const exact = findSeoCityByGeo(cityName, stateCode);
  if (exact) return exact;
  if (!cityName || !stateCode) return null;
  const code = stateCode.toUpperCase();
  const n = normalizeCityName(cityName);
  if (n.length < 3) return null;

  const inState = SEO_CITIES.filter((c) => c.state === code);
  const nSt = normalizeForStVariant(cityName);

  const candidates: SeoCity[] = [];

  for (const c of inState) {
    const cn = normalizeCityName(c.name);
    const cnSt = normalizeForStVariant(c.name);
    if (cn === n || cnSt === nSt) {
      candidates.push(c);
      continue;
    }
    // "Fresno County" / "City of Modesto" style strings from geocoders
    if (cn.length >= 4 && (n.includes(cn) || n.startsWith(cn + ' ') || n.endsWith(' ' + cn))) {
      candidates.push(c);
      continue;
    }
    if (n.length >= 4 && (cn.includes(n) || cn.startsWith(n + ' ') || cn.endsWith(' ' + n))) {
      candidates.push(c);
    }
  }

  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  // Prefer longest city name match to reduce ambiguity (e.g. "San" matching many)
  candidates.sort((a, b) => normalizeCityName(b.name).length - normalizeCityName(a.name).length);
  const best = candidates[0];
  const bestLen = normalizeCityName(best.name).length;
  const tied = candidates.filter((c) => normalizeCityName(c.name).length === bestLen);
  return tied.length === 1 ? best : null;
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

function normalizeCountyName(county: string): string {
  return county
    .trim()
    .toLowerCase()
    .replace(/\+/g, ' ')
    .replace(/\s+county$/i, '')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '');
}

/**
 * Find the best SEO city in a given county. Prefers the one with popularSituations defined,
 * then the first alphabetically (deterministic).
 */
function findSeoCityByCounty(countyRaw: string, stateCode: string): SeoCity | null {
  const nc = normalizeCountyName(countyRaw);
  if (!nc) return null;
  const matches = SEO_CITIES.filter(
    (c) => c.state === stateCode && normalizeCountyName(c.county) === nc
  );
  if (matches.length === 0) return null;
  const withPopular = matches.filter((c) => c.popularSituations?.length);
  if (withPopular.length > 0) return withPopular[0];
  return matches[0];
}

export function resolveLocalArea(
  geoCity: string | null | undefined,
  stateCode: string | null | undefined,
  geoCounty?: string | null
): ResolvedLocalArea | null {
  const code = stateCode?.toUpperCase() ?? null;
  if (!code || !isServedState(code)) return null;

  // 1) Exact or fuzzy city name match
  const resolvedCity = findSeoCityByGeoFuzzy(geoCity, code);
  if (resolvedCity) {
    return {
      city: resolvedCity,
      approximate: false,
      detectedCityName: geoCity ?? undefined,
      popular: popularSituationsForCity(resolvedCity),
    };
  }

  // 2) County match — much better than the state hub
  if (geoCounty) {
    const countyCity = findSeoCityByCounty(geoCounty, code);
    if (countyCity) {
      return {
        city: countyCity,
        approximate: false,
        detectedCityName: geoCity ?? undefined,
        popular: popularSituationsForCity(countyCity),
      };
    }
  }

  // 3) State hub as last resort
  const hub = hubCityForState(code);
  if (!hub) return null;

  return {
    city: hub,
    approximate: true,
    detectedCityName: geoCity ?? undefined,
    popular: popularSituationsForCity(hub),
  };
}
