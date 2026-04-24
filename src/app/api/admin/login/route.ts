import { NextResponse } from 'next/server';
import {
  adminCredentialsValid,
  appendAdminSessionCookie,
  getSessionTokenValue,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const { username, password } = body;
    if (!adminCredentialsValid(String(username), String(password))) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
    const token = getSessionTokenValue();
    if (!token) {
      return NextResponse.json(
        {
          error:
            'Admin session not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in the server environment.',
        },
        { status: 500 }
      );
    }
    const res = NextResponse.json({ ok: true });
    appendAdminSessionCookie(res, token);
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
