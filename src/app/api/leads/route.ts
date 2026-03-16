import { NextResponse } from 'next/server';

const NICHEDATA_API_URL = 'https://customers-api.nichedata.ai/notices';

export async function GET() {
  try {
    const token = process.env.NICHEDATA_API_TOKEN;
    
    if (!token) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(NICHEDATA_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NicheData API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Failed to fetch leads: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching leads from NicheData:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
