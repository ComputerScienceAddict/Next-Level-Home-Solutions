import { createClient } from '@supabase/supabase-js';
import type { SeoCity, SellerSituation } from '@/data/seo-targets';
import { buildSeoPageContent, SeoPageContent } from './seo-content';

type AiSeoPage = {
  title: string;
  meta_description: string;
  h1: string;
  intro: string;
  local_angle: string;
  how_we_help: string[];
  zip_section: string;
  faqs: { q: string; a: string }[];
  cta: string;
  status: string;
};

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

async function fetchAiContent(situationSlug: string, citySlug: string): Promise<AiSeoPage | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('seo_pages')
      .select('*')
      .eq('situation_slug', situationSlug)
      .eq('city_slug', citySlug)
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as AiSeoPage;
  } catch {
    return null;
  }
}

function aiToSeoContent(ai: AiSeoPage): SeoPageContent {
  return {
    title: ai.title,
    description: ai.meta_description,
    h1: ai.h1,
    intro: ai.intro,
    localAngle: ai.local_angle,
    bullets: ai.how_we_help || [],
    zipSection: ai.zip_section,
    faqs: ai.faqs || [],
    cta: ai.cta,
  };
}

/**
 * Load SEO content for a page.
 * - If published AI content exists in Supabase, use it.
 * - Otherwise, fall back to template-generated content.
 */
export async function loadSeoContent(
  situation: SellerSituation,
  city: SeoCity
): Promise<{ content: SeoPageContent; source: 'ai' | 'template' }> {
  const ai = await fetchAiContent(situation.slug, city.slug);
  
  if (ai) {
    return { content: aiToSeoContent(ai), source: 'ai' };
  }
  
  return { content: buildSeoPageContent(situation, city), source: 'template' };
}
