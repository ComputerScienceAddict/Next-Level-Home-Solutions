import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { HOME_ENTRY_COOKIE } from '@/lib/entry-cookie';

/** Let search/social crawlers hit the real homepage (no cookie gate) */
function isLikelyBot(ua: string) {
  return /Googlebot|AdsBot-Google|bingbot|Slurp|DuckDuckBot|facebookexternalhit|Facebot|LinkedInBot|SemrushBot|AhrefsBot|Applebot|YandexBot|PetalBot|Bytespider|GPTBot/i.test(
    ua
  );
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== '/') {
    return NextResponse.next();
  }

  const ua = request.headers.get('user-agent') || '';
  if (isLikelyBot(ua)) {
    return NextResponse.next();
  }

  if (request.cookies.get(HOME_ENTRY_COOKIE)?.value === '1') {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/welcome';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/'],
};
