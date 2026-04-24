import { NextResponse } from 'next/server';
import { requireAdminOr401 } from '@/lib/admin-auth';
import { generateWithAIJson, getActiveAiProvider } from '@/lib/ai';

export const dynamic = 'force-dynamic';

/** Quick check that Gemini/OpenAI keys work (admin / debugging) */
export async function GET(request: Request) {
  const denied = requireAdminOr401(request);
  if (denied) return denied;
  const provider = getActiveAiProvider();
  if (provider === 'none') {
    return NextResponse.json({ ok: false, provider, error: 'No GEMINI_API_KEY or OPENAI_API_KEY' });
  }
  const text = await generateWithAIJson(
    'Reply with JSON only: {"ping":"ok"}',
    'Output valid JSON only.'
  );
  if (!text) {
    return NextResponse.json({ ok: false, provider, error: 'Model returned empty' });
  }
  try {
    const j = JSON.parse(text);
    return NextResponse.json({ ok: true, provider, sample: j });
  } catch {
    return NextResponse.json({ ok: false, provider, error: 'Invalid JSON', raw: text.slice(0, 200) });
  }
}
