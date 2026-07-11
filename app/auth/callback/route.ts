import { NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase/server';

/**
 * GET /auth/callback
 * OAuth redirect target. Supabase sends the user here with a `code` after they
 * authenticate with Google. We exchange that code for a session (which sets the
 * auth cookies) and then bounce the user back to wherever they started.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next') ?? '/';

  // Only allow relative, same-origin redirects to avoid an open-redirect.
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//')
    ? nextParam
    : '/';

  if (code) {
    const supabase = await createRouteClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error('Error exchanging OAuth code for session:', error);
  }

  // Something went wrong - send them home rather than leaving them stranded.
  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
