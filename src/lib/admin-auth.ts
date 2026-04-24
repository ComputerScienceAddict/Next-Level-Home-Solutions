import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'nlhs_admin';

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function expectedUsername(): string {
  return process.env.ADMIN_USERNAME?.trim() || 'admin';
}

function expectedPassword(): string {
  const fromEnv = process.env.ADMIN_PASSWORD;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  if (process.env.NODE_ENV === 'development') return 'admin123';
  return '';
}

function sessionSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (s && s.length > 0) return s;
  if (process.env.NODE_ENV === 'development') return 'dev-only-set-admin-session-secret-in-production';
  return '';
}

/** HMAC value stored in the HttpOnly session cookie (stable for this deploy + credentials). */
export function getSessionTokenValue(): string {
  const secret = sessionSecret();
  const p = expectedPassword();
  if (!secret || !p) return '';
  return createHmac('sha256', secret)
    .update(`${expectedUsername()}:${p}`)
    .digest('hex');
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const x = Buffer.from(a, 'utf8');
  const y = Buffer.from(b, 'utf8');
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

export function adminCredentialsValid(username: string, password: string): boolean {
  const u = String(username || '').trim();
  const p = String(password || '');
  const exp = expectedPassword();
  if (!exp) return false;
  if (u !== expectedUsername()) return false;
  return timingSafeStringEqual(p, exp);
}

function readCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    const k = part.slice(0, idx).trim();
    if (k === name) {
      let v = part.slice(idx + 1);
      try {
        v = decodeURIComponent(v);
      } catch {
        // keep raw
      }
      return v;
    }
  }
  return null;
}

export function isAdminSession(request: Request): boolean {
  const expected = getSessionTokenValue();
  if (!expected) return false;
  const fromCookie = readCookieValue(request.headers.get('cookie'), ADMIN_SESSION_COOKIE);
  if (!fromCookie) return false;
  return timingSafeStringEqual(fromCookie, expected);
}

function cookieBaseAttributes(): string {
  const base = `Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SEC}`;
  if (process.env.NODE_ENV === 'production') {
    return `${base}; Secure`;
  }
  return base;
}

export function appendAdminSessionCookie(response: NextResponse, token: string): void {
  const raw = `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}; ${cookieBaseAttributes()}`;
  response.headers.append('Set-Cookie', raw);
}

export function clearAdminSessionCookie(response: NextResponse): void {
  const base = 'Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.headers.append('Set-Cookie', `${ADMIN_SESSION_COOKIE}=; ${base}${secure}`);
}

export function requireAdminOr401(request: Request): NextResponse | null {
  if (!isAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
