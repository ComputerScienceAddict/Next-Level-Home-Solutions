/**
 * Cookie set after visitor completes welcome flow — middleware allows `/` when present.
 * (Constant is imported by Edge middleware — keep this file free of Node-only APIs.)
 */
export const HOME_ENTRY_COOKIE = 'nlhs_home_entry';
export const HOME_ENTRY_MAX_AGE_SEC = 60 * 60 * 24 * 180; // 180 days

export function setHomeEntryCookieClient() {
  if (typeof document === 'undefined') return;
  document.cookie = `${HOME_ENTRY_COOKIE}=1; Path=/; Max-Age=${HOME_ENTRY_MAX_AGE_SEC}; SameSite=Lax`;
}
