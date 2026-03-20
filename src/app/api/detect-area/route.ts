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

type NominatimResponse = {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    state_code?: string;
  };
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

async function reverseGeocode(lat: number, lng: number): Promise<{ city?: string; region?: string } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'NextLevelHomeSolutions/1.0',
          Accept: 'application/json',
        },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as NominatimResponse;
    const addr = data.address;
    if (!addr) return null;
    const city = addr.city || addr.town || addr.village;
    const region = addr.state_code || addr.state;
    return { city, region };
  } catch {
    return null;
  }
}

/**
 * Detect visitor area for personalization (homepage, /areas, popular situations).
 * 1) Query params (lat/lng or city/state override)
 * 2) Vercel geo headers on production
 * 3) IP lookup (ipwho.is) as fallback
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const overrideCity = searchParams.get('city');
  const overrideRegion = searchParams.get('state') || searchParams.get('region');
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');

  let geoCity: string | null = overrideCity;
  let region: string | null = overrideRegion;

  let source: 'gps' | 'query' | 'vercel' | 'ip' | 'none' = 'none';

  if (latStr && lngStr) {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (!isNaN(lat) && !isNaN(lng)) {
      const gpsData = await reverseGeocode(lat, lng);
      if (gpsData?.city && gpsData.region) {
        geoCity = gpsData.city;
        region = gpsData.region;
        source = 'gps';
      }
    }
  }

  if (!geoCity && overrideCity && overrideRegion) {
    geoCity = overrideCity;
    region = overrideRegion;
    source = 'query';
  }

  if (!geoCity) {
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
