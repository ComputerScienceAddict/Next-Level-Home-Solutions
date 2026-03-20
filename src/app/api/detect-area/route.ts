import { NextRequest, NextResponse } from 'next/server';
import { normalizeStateCode, resolveLocalArea } from '@/lib/geo-match';

export const dynamic = 'force-dynamic';

type IpWhoResponse = {
  success?: boolean;
  city?: string;
  region?: string;
  region_code?: string;
  country_code?: string;
};

async function lookupIp(ip: string): Promise<{ city?: string; region?: string } | null> {
  const clean = ip.split(',')[0]?.trim();
  if (!clean || clean === '127.0.0.1' || clean === '::1') return null;
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(clean)}`, {
      next: { revalidate: 0 },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as IpWhoResponse;
    if (data.success === false) return null;
    return {
      city: data.city,
      region: data.region_code || data.region,
    };
  } catch {
    return null;
  }
}

/**
 * Detect visitor area for personalization (homepage, /areas, popular situations).
 * 1) Vercel geo headers on production
 * 2) IP lookup (ipwho.is) as fallback
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const overrideCity = searchParams.get('city');
  const overrideRegion = searchParams.get('state') || searchParams.get('region');

  let geoCity: string | null = overrideCity;
  let region: string | null = overrideRegion;

  let source: 'query' | 'vercel' | 'ip' | 'none' = 'none';

  if (geoCity && region) {
    source = 'query';
  } else {
    const vCity = request.headers.get('x-vercel-ip-city');
    const vRegion = request.headers.get('x-vercel-ip-country-region');
    if (vCity && vRegion) {
      geoCity = vCity;
      region = vRegion;
      source = 'vercel';
    } else {
      const forwarded = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const ip = forwarded?.split(',')[0]?.trim() || realIp || '';
      const ipData = await lookupIp(ip);
      if (ipData?.city && ipData.region) {
        geoCity = ipData.city;
        region = ipData.region;
        source = 'ip';
      }
    }
  }

  const stateCode = normalizeStateCode(region);
  const resolved = resolveLocalArea(geoCity, stateCode);

  if (!resolved) {
    return NextResponse.json({
      ok: true,
      matched: false,
      source,
      message: 'Outside served states or location unknown — browse Areas to pick your city.',
    });
  }

  return NextResponse.json({
    ok: true,
    matched: true,
    source,
    approximate: resolved.approximate,
    detectedCityName: resolved.detectedCityName,
    city: {
      slug: resolved.city.slug,
      name: resolved.city.name,
      state: resolved.city.state,
      county: resolved.city.county,
    },
    popularSituations: resolved.popular,
  });
}
