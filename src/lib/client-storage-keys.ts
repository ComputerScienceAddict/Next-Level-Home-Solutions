/**
 * All `localStorage` keys this app uses -- browser-only, not sent to the server automatically.
 *
 * | Key | Purpose |
 * |-----|---------|
 * | `nlhs_detect_area_v4` | Caches `/api/detect-area` for 24h (v4: county matching before hub fallback). |
 * | `nlhs_preferred_situation` | Last situation slug chosen in the areas flow (if used). |
 * | `nlhs_preferred_city` | Last city slug (e.g. `fresno-ca`) from the areas flow (if used). |
 *
 * **Nothing sensitive** (no name, address, or API keys). Users can clear site data anytime.
 *
 * **Supabase (optional later):** If you want the same prefs across devices or analytics in the DB,
 * add a table (see bottom of `supabase_schema.sql`) keyed by a random `anon_id` UUID you store
 * in localStorage once -- then upsert `preferred_situation_slug` when prefs are saved.
 * Not required for the current UX; localStorage is enough for one browser.
 */
export const NLHS_STORAGE = {
  DETECT_AREA_CACHE: 'nlhs_detect_area_v4',
  PREFERRED_SITUATION: 'nlhs_preferred_situation',
  PREFERRED_CITY: 'nlhs_preferred_city',
} as const;
