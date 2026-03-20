import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { business } from '@/config/business';
import { SEO_CITIES, SELLER_SITUATIONS } from '@/data/seo-targets';
import { generateWithAI } from '@/lib/ai';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type AnalysisResult = {
  source: 'heuristic' | 'ai';
  timestamp: string;
  business: {
    name: string;
    primaryMarket: string;
    phone: string;
  };
  marketAnalysis: {
    topCities: { slug: string; name: string; county: string; priority: string; reason: string }[];
    topSituations: { slug: string; title: string; priority: string; reason: string }[];
  };
  contentStrategy: {
    immediateActions: string[];
    contentGaps: string[];
    competitiveInsights: string[];
  };
  metrics: {
    totalPagesConfigured: number;
    citiesConfigured: number;
    situationsConfigured: number;
  };
  summary: string;
};

function heuristicAnalysis(): AnalysisResult {
  const topCities = [...SEO_CITIES]
    .sort((a, b) => b.zips.length - a.zips.length)
    .slice(0, 10)
    .map((c, i) => ({
      slug: c.slug,
      name: c.name,
      county: c.county,
      priority: i < 3 ? 'high' : i < 6 ? 'medium' : 'low',
      reason: `${c.county} County market with ${c.zips.length} tracked ZIP codes.`,
    }));

  const topSituations = SELLER_SITUATIONS.map((s, i) => ({
    slug: s.slug,
    title: s.title,
    priority: i < 2 ? 'high' : i < 4 ? 'medium' : 'low',
    reason: s.searchTerms.slice(0, 2).join(', ') + ' — strong search intent.',
  }));

  return {
    source: 'heuristic',
    timestamp: new Date().toISOString(),
    business: {
      name: business.name,
      primaryMarket: business.primaryMarket,
      phone: business.phone,
    },
    marketAnalysis: {
      topCities,
      topSituations,
    },
    contentStrategy: {
      immediateActions: [
        'Generate AI content for top 3 cities × all situations (18 pages)',
        'Add internal links from homepage to /sell hub',
        'Submit sitemap to Google Search Console',
      ],
      contentGaps: [
        'Consider adding more Central Valley cities (Ceres, Los Banos, Patterson)',
        'Add ZIP-specific landing pages for high-competition areas',
        'Create blog content targeting "how to sell house fast [city]"',
      ],
      competitiveInsights: [
        'Foreclosure + divorce have highest commercial intent',
        'Inherited property has less competition but longer sales cycle',
        'Vacant house searches spike seasonally',
      ],
    },
    metrics: {
      totalPagesConfigured: SEO_CITIES.length * SELLER_SITUATIONS.length,
      citiesConfigured: SEO_CITIES.length,
      situationsConfigured: SELLER_SITUATIONS.length,
    },
    summary:
      'Heuristic analysis based on configured cities (ZIP count as priority proxy). Add GEMINI_API_KEY or OPENAI_API_KEY for AI-powered market insights.',
  };
}

async function aiAnalysis(): Promise<AnalysisResult | null> {
  const hasKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!hasKey) return null;

  const prompt = `You are an expert SEO strategist specializing in real estate investor websites (we buy houses companies).

BUSINESS TO ANALYZE:
${JSON.stringify(business, null, 2)}

CONFIGURED MARKETS:
Cities: ${SEO_CITIES.map((c) => `${c.name} (${c.county} County, ZIPs: ${c.zips.join(', ')})`).join('; ')}

Seller Situations: ${SELLER_SITUATIONS.map((s) => `${s.slug}: ${s.title} - ${s.searchTerms.join(', ')}`).join('; ')}

ANALYSIS TASK:
Analyze this business and its configured markets. Consider:
1. Which cities should be highest priority based on population, foreclosure rates, and competition?
2. Which seller situations have the highest commercial intent and conversion potential?
3. What content gaps exist? What pages or topics are missing?
4. What immediate actions should they take to improve SEO?

Return ONLY valid JSON (no markdown) with this structure:
{
  "topCities": [
    {"slug": "city-slug", "name": "City Name", "county": "County", "priority": "high|medium|low", "reason": "why this city"}
  ],
  "topSituations": [
    {"slug": "situation-slug", "title": "Situation Title", "priority": "high|medium|low", "reason": "why prioritize"}
  ],
  "immediateActions": ["action 1", "action 2", "action 3", "action 4", "action 5"],
  "contentGaps": ["gap 1", "gap 2", "gap 3"],
  "competitiveInsights": ["insight 1", "insight 2", "insight 3"],
  "summary": "2-3 sentence executive summary of the analysis"
}

Include all configured cities and situations in your rankings. Be specific and actionable.`;

  try {
    const text = await generateWithAI(
      prompt,
      'You are an SEO expert. Return only valid JSON, no markdown formatting or code blocks.'
    );
    if (!text) return null;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      source: 'ai',
      timestamp: new Date().toISOString(),
      business: {
        name: business.name,
        primaryMarket: business.primaryMarket,
        phone: business.phone,
      },
      marketAnalysis: {
        topCities: parsed.topCities ?? [],
        topSituations: parsed.topSituations ?? [],
      },
      contentStrategy: {
        immediateActions: parsed.immediateActions ?? [],
        contentGaps: parsed.contentGaps ?? [],
        competitiveInsights: parsed.competitiveInsights ?? [],
      },
      metrics: {
        totalPagesConfigured: SEO_CITIES.length * SELLER_SITUATIONS.length,
        citiesConfigured: SEO_CITIES.length,
        situationsConfigured: SELLER_SITUATIONS.length,
      },
      summary: parsed.summary ?? 'AI analysis complete.',
    };
  } catch (e) {
    console.error('AI analysis error:', e);
    return null;
  }
}

async function saveAnalysis(analysis: AnalysisResult): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase.from('seo_analysis').insert({
      analysis_type: analysis.source,
      recommended_cities: analysis.marketAnalysis.topCities,
      recommended_situations: analysis.marketAnalysis.topSituations,
      market_insights: analysis.summary,
      content_gaps: analysis.contentStrategy.contentGaps,
      priority_actions: analysis.contentStrategy.immediateActions,
      ai_model: analysis.source === 'ai' ? (process.env.GEMINI_API_KEY ? 'gemini-1.5-flash' : 'gpt-4o') : null,
    });
  } catch (e) {
    console.error('Failed to save analysis:', e);
  }
}

export async function GET() {
  const ai = await aiAnalysis();
  const result = ai ?? heuristicAnalysis();
  await saveAnalysis(result);
  return NextResponse.json(result);
}

export async function POST() {
  return GET();
}
