/**
 * AI: Gemini (preferred) with model fallbacks, then OpenAI.
 */

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-latest',
] as const;

type GeminiBody = Record<string, unknown>;

async function callGemini(model: string, key: string, body: GeminiBody): Promise<{ ok: boolean; text?: string; err?: string }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const raw = await res.text();
  if (!res.ok) {
    return { ok: false, err: `${res.status}: ${raw.slice(0, 500)}` };
  }
  let data: {
    candidates?: Array<{
      finishReason?: string;
      content?: { parts?: Array<{ text?: string }> };
    }>;
    error?: { message?: string };
  };
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, err: 'Invalid JSON from Gemini' };
  }
  if (data.error?.message) {
    return { ok: false, err: data.error.message };
  }
  const candidate = data.candidates?.[0];
  if (!candidate) {
    return { ok: false, err: 'No candidates (blocked or empty)' };
  }
  if (candidate.finishReason && candidate.finishReason !== 'STOP') {
    return { ok: false, err: `finishReason: ${candidate.finishReason}` };
  }
  const text = candidate.content?.parts?.map((p) => p.text ?? '').join('')?.trim();
  if (!text) {
    return { ok: false, err: 'Empty response text' };
  }
  return { ok: true, text };
}

async function generateWithGemini(
  prompt: string,
  systemPrompt: string | undefined,
  key: string,
  jsonMode: boolean
): Promise<string | null> {
  const generationConfig: Record<string, unknown> = {
    temperature: 0.65,
    maxOutputTokens: 8192,
  };
  if (jsonMode) {
    generationConfig.responseMimeType = 'application/json';
  }

  const body: GeminiBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig,
  };
  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  for (const model of GEMINI_MODELS) {
    const out = await callGemini(model, key, body);
    if (out.ok && out.text) {
      return out.text;
    }
    console.warn(`[AI] Gemini model ${model} failed:`, out.err);
  }
  return null;
}

async function generateWithOpenAI(
  prompt: string,
  systemPrompt: string | undefined,
  key: string,
  jsonMode: boolean
): Promise<string | null> {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.65,
        ...(jsonMode
          ? { response_format: { type: 'json_object' as const } }
          : {}),
        messages: [
          ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
          { role: 'user' as const, content: prompt },
        ],
      }),
    });
    if (!res.ok) {
      console.error('[AI] OpenAI:', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (e) {
    console.error('[AI] OpenAI error:', e);
    return null;
  }
}

/**
 * Plain text / markdown response
 */
export async function generateWithAI(prompt: string, systemPrompt?: string): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    const text = await generateWithGemini(prompt, systemPrompt, geminiKey, false);
    if (text) return text;
  }
  if (openaiKey) {
    return generateWithOpenAI(prompt, systemPrompt, openaiKey, false);
  }
  return null;
}

/**
 * Structured JSON — Gemini JSON mode + OpenAI json_object
 */
export async function generateWithAIJson(prompt: string, systemPrompt?: string): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    const text = await generateWithGemini(prompt, systemPrompt, geminiKey, true);
    if (text) return text;
  }
  if (openaiKey) {
    return generateWithOpenAI(prompt, systemPrompt, openaiKey, true);
  }
  return null;
}

export function getActiveAiProvider(): 'gemini' | 'openai' | 'none' {
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return 'none';
}
