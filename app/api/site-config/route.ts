import { NextRequest, NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/supabase/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'general';

    const config = await getSiteConfig(category);

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site config' },
      { status: 500 }
    );
  }
}
