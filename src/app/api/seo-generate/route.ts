import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { business } from '@/config/business';
import { getCityBySlug, getSituationBySlug, SEO_CITIES, SELLER_SITUATIONS } from '@/data/seo-targets';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const PROMPT_VERSION = 'v1.0';

type GeneratedContent = {
  title: string;
  meta_description: string;
  h1: string;
  intro: string;
  local_angle: string;
  how_we_help: string[];
  zip_section: string;
  faqs: { q: string; a: string }[];
  cta: string;
};

function buildPrompt(situationSlug: string, citySlug: string): string | null {
  const situation = getSituationBySlug(situationSlug);
  const city = getCityBySlug(citySlug);
  if (!situation || !city) return null;

  return `You are an expert SEO copywriter for a real estate investment company that buys houses directly from homeowners.

BUSINESS CONTEXT:
- Company: ${business.name}
- Phone: ${business.phone}
- Primary Market: ${business.primaryMarket}
- Value Props: ${business.valueProps.join('; ')}
- Elevator Pitch: ${business.elevatorPitch}

TARGET PAGE:
- City: ${city.name}, ${city.state} (${city.county} County)
- ZIP Codes: ${city.zips.join(', ')}
- Seller Situation: ${situation.title}
- Situation Context: ${situation.painSummary}
- Search Terms People Use: ${situation.searchTerms.join(', ')}

TASK:
Write unique, helpful SEO content for a landing page targeting homeowners in ${city.name} who are ${situation.title.toLowerCase()}. The content should:
1. Be empathetic and professional (not salesy or pushy)
2. Include specific references to ${city.name}, ${city.county} County, and the ZIP codes
3. Address the specific pain points of ${situation.title.toLowerCase()}
4. Naturally incorporate search terms without keyword stuffing
5. Be factual and avoid making claims that could be legally problematic

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "title": "SEO title tag (50-60 chars, include city + situation)",
  "meta_description": "Meta description (150-160 chars, compelling, include phone)",
  "h1": "Main headline (clear, benefit-focused, include city)",
  "intro": "Opening paragraph (2-3 sentences, empathetic, address pain point)",
  "local_angle": "Paragraph about why we serve ${city.name} specifically (2-3 sentences, mention county/zips)",
  "how_we_help": ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4", "Bullet 5"],
  "zip_section": "Paragraph about ZIP codes we serve (1-2 sentences)",
  "faqs": [
    {"q": "Question about ${situation.shortLabel} in ${city.name}?", "a": "Helpful answer"},
    {"q": "Question about process?", "a": "Helpful answer"},
    {"q": "Question about costs/fees?", "a": "Helpful answer"},
    {"q": "Question about timeline?", "a": "Helpful answer"}
  ],
  "cta": "Call to action sentence with phone number"
}`;
}

async function generateWithOpenAI(prompt: string): Promise<GeneratedContent | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are an expert SEO copywriter. Return only valid JSON, no markdown formatting.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    console.error('OpenAI API error:', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim() ?? '';
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('No JSON found in OpenAI response');
    return null;
  }

  try {
    return JSON.parse(jsonMatch[0]) as GeneratedContent;
  } catch (e) {
    console.error('Failed to parse OpenAI JSON:', e);
    return null;
  }
}

async function saveToSupabase(
  situationSlug: string,
  citySlug: string,
  content: GeneratedContent,
  model: string
): Promise<{ success: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return { success: false, error: 'Supabase not configured' };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase.from('seo_pages').upsert(
    {
      situation_slug: situationSlug,
      city_slug: citySlug,
      title: content.title,
      meta_description: content.meta_description,
      h1: content.h1,
      intro: content.intro,
      local_angle: content.local_angle,
      how_we_help: content.how_we_help,
      zip_section: content.zip_section,
      faqs: content.faqs,
      cta: content.cta,
      ai_model: model,
      ai_prompt_version: PROMPT_VERSION,
      status: 'draft',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'situation_slug,city_slug' }
  );

  if (error) {
    console.error('Supabase save error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { situation, city, generateAll } = body as {
      situation?: string;
      city?: string;
      generateAll?: boolean;
    };

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured. Add it to .env.local to enable AI content generation.' },
        { status: 400 }
      );
    }

    // Generate all pages
    if (generateAll) {
      const results: { situation: string; city: string; success: boolean; error?: string }[] = [];
      
      for (const s of SELLER_SITUATIONS) {
        for (const c of SEO_CITIES) {
          const prompt = buildPrompt(s.slug, c.slug);
          if (!prompt) continue;

          const content = await generateWithOpenAI(prompt);
          if (content) {
            const saveResult = await saveToSupabase(s.slug, c.slug, content, 'gpt-4o');
            results.push({ situation: s.slug, city: c.slug, ...saveResult });
          } else {
            results.push({ situation: s.slug, city: c.slug, success: false, error: 'AI generation failed' });
          }
          
          // Rate limit: wait between requests
          await new Promise((r) => setTimeout(r, 500));
        }
      }

      const successful = results.filter((r) => r.success).length;
      return NextResponse.json({
        success: true,
        message: `Generated ${successful} of ${results.length} pages`,
        results,
      });
    }

    // Generate single page
    if (!situation || !city) {
      return NextResponse.json(
        { error: 'Provide situation and city slugs, or set generateAll: true' },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(situation, city);
    if (!prompt) {
      return NextResponse.json({ error: 'Invalid situation or city slug' }, { status: 400 });
    }

    const content = await generateWithOpenAI(prompt);
    if (!content) {
      return NextResponse.json({ error: 'AI content generation failed' }, { status: 500 });
    }

    const saveResult = await saveToSupabase(situation, city, content, 'gpt-4o');
    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error, content },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Generated content for ${situation}/${city}`,
      content,
    });
  } catch (error) {
    console.error('SEO generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    info: 'POST to this endpoint to generate AI SEO content',
    singlePage: { situation: 'foreclosure', city: 'fresno-ca' },
    allPages: { generateAll: true },
    requires: 'OPENAI_API_KEY in .env.local',
  });
}
