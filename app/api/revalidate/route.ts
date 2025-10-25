import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createRouteClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { paths } = body;

    // Validate paths parameter
    if (!Array.isArray(paths)) {
      return NextResponse.json(
        { error: 'Invalid request: paths must be an array' },
        { status: 400 }
      );
    }

    // Validate each path is a string
    for (const path of paths) {
      if (typeof path !== 'string') {
        return NextResponse.json(
          { error: 'Invalid request: all paths must be strings' },
          { status: 400 }
        );
      }
    }

    // Revalidate each path
    paths.forEach(path => {
      try {
        revalidatePath(path);
      } catch (err) {
        console.error(`Failed to revalidate path: ${path}`, err);
      }
    });

    return NextResponse.json({
      revalidated: true,
      paths,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json(
      { error: 'Internal server error during revalidation' },
      { status: 500 }
    );
  }
}
