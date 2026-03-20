'use client';

import { useCallback, useEffect, useState } from 'react';
import { NLHS_STORAGE } from '@/lib/client-storage-keys';

const STORAGE_KEY = NLHS_STORAGE.DETECT_AREA_CACHE;
const MAX_AGE_MS = 1000 * 60 * 60 * 24; // 24h

/** One in-flight request shared by all useDetectArea() subscribers */
let sharedFetch: Promise<DetectAreaResult> | null = null;

export type DetectedPopular = { slug: string; title: string; shortLabel: string };

export type DetectAreaResult =
  | {
      matched: true;
      approximate: boolean;
      detectedCityName?: string;
      city: { slug: string; name: string; state: string; county: string };
      popularSituations: DetectedPopular[];
      source: string;
    }
  | {
      matched: false;
      source: string;
      message?: string;
    };

function readCache(): DetectAreaResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { at, payload } = JSON.parse(raw) as { at: number; payload: DetectAreaResult };
    if (Date.now() - at > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function writeCache(payload: DetectAreaResult) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now(), payload }));
  } catch {
    /* ignore */
  }
}

async function fetchDetectAreaFromApi(lat?: number, lng?: number): Promise<DetectAreaResult> {
  const params = new URLSearchParams();
  if (lat !== undefined && lng !== undefined) {
    params.set('lat', lat.toString());
    params.set('lng', lng.toString());
  }
  const url = `/api/detect-area${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url, { cache: 'no-store' });
  const json = (await res.json()) as DetectAreaResult & { ok?: boolean };
  if (!res.ok) {
    return { matched: false, source: 'error', message: 'Could not detect location.' };
  }
  const payload = json as DetectAreaResult;
  writeCache(payload);
  return payload;
}

function loadDetectArea(lat?: number, lng?: number): Promise<DetectAreaResult> {
  if (lat !== undefined && lng !== undefined) {
    return fetchDetectAreaFromApi(lat, lng);
  }
  const cached = readCache();
  if (cached) return Promise.resolve(cached);
  if (!sharedFetch) {
    sharedFetch = fetchDetectAreaFromApi().finally(() => {
      sharedFetch = null;
    });
  }
  return sharedFetch;
}

export function useDetectArea(gpsLat?: number, gpsLng?: number) {
  const [data, setData] = useState<DetectAreaResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      const payload = await fetchDetectAreaFromApi();
      setData(payload);
    } catch {
      setError('Network error');
      setData({ matched: false, source: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void loadDetectArea(gpsLat, gpsLng).then((payload) => {
      if (!cancelled) {
        setData(payload);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [gpsLat, gpsLng]);

  return { data, loading, error, refresh };
}
