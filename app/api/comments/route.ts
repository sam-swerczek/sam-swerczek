import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createRouteClient } from '@/lib/supabase/server';
import { getCommentsByPostId } from '@/lib/supabase/queries';
import { createComment } from '@/lib/supabase/mutations';
import { sanitizeText } from '@/lib/utils/sanitize';
import { isValidUUID } from '@/lib/utils/validators';
import { rateLimiters, getRateLimitHeaders } from '@/lib/utils/rate-limit';

/**
 * GET /api/comments?postId=xxx
 * Get all visible comments for a post
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    // Validate UUID format to prevent malicious input
    if (!isValidUUID(postId)) {
      return NextResponse.json(
        { error: 'Invalid postId format' },
        { status: 400 }
      );
    }

    const comments = await getCommentsByPostId(postId);

    return NextResponse.json({ data: comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments
 * Create a new comment (requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication - use route client that reads cookies
    const supabase = await createRouteClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check rate limit - 5 comments per hour per user
    const rateLimitResult = rateLimiters.commentCreate(user.id);
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.reset);
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          resetAt: resetDate.toISOString(),
          limit: rateLimitResult.limit,
          remaining: 0,
        },
        {
          status: 429,
          headers: rateLimitHeaders,
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { postId, content } = body;

    // Validate input
    if (!postId || !content) {
      return NextResponse.json(
        { error: 'postId and content are required' },
        { status: 400 }
      );
    }

    // Validate UUID format to prevent malicious input
    if (!isValidUUID(postId)) {
      return NextResponse.json(
        { error: 'Invalid postId format' },
        { status: 400 }
      );
    }

    // Validate content
    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      );
    }

    if (trimmedContent.length > 5000) {
      return NextResponse.json(
        { error: 'Comment content must be 5000 characters or less' },
        { status: 400 }
      );
    }

    // Sanitize content to prevent XSS attacks
    // Strip out any HTML/script tags - plain text only
    const sanitizedContent = sanitizeText(trimmedContent);

    // Create comment - pass authenticated supabase client
    const comment = await createComment(supabase, {
      post_id: postId,
      author_id: user.id,
      content: sanitizedContent,
      is_visible: true, // Auto-visible (no moderation for now)
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      );
    }

    // Revalidate blog pages to show new comment
    revalidatePath('/blog');
    revalidatePath('/'); // Home page shows activity timeline

    return NextResponse.json(
      { data: comment },
      {
        status: 201,
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
