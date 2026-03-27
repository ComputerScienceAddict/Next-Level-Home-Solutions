import { NLHS_STORAGE } from '@/lib/client-storage-keys';

/** Preferred situation slug in localStorage (see `NLHS_STORAGE` docs). */
export const PREFERRED_SITUATION_KEY = NLHS_STORAGE.PREFERRED_SITUATION;
export const PREFERRED_CITY_KEY = NLHS_STORAGE.PREFERRED_CITY;

export function getPreferredSituationSlug(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(NLHS_STORAGE.PREFERRED_SITUATION);
  } catch {
    return null;
  }
}

export function getPreferredCitySlug(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(NLHS_STORAGE.PREFERRED_CITY);
  } catch {
    return null;
  }
}
