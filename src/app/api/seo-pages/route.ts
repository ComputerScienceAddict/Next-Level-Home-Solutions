import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const situation = searchParams.get('situation');
  const city = searchParams.get('city');
  const status = searchParams.get('status');

  let query = supabase.from('seo_pages').select('*').order('updated_at', { ascending: false });

  if (situation) query = query.eq('situation_slug', situation);
  if (city) query = query.eq('city_slug', city);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ pages: [], error: error.message });
  }

  return NextResponse.json({ pages: data || [] });
}

export async function PATCH(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, status } = body as { id: string; status: string };

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await supabase.from('seo_pages').update(updateData).eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('PATCH error:', e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
