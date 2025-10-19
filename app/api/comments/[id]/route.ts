import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createRouteClient } from '@/lib/supabase/server';
import { updateComment, deleteComment } from '@/lib/supabase/mutations';
import { sanitizeText } from '@/lib/utils/sanitize';
import { isValidUUID } from '@/lib/utils/validators';
import { rateLimiters, getRateLimitHeaders } from '@/lib/utils/rate-limit';

/**
 * PUT /api/comments/[id]
 * Update a comment (requires authentication + ownership)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15 requirement)
    const { id: commentId } = await params;

    // Validate UUID format to prevent malicious input
    if (!isValidUUID(commentId)) {
      return NextResponse.json(
        { error: 'Invalid comment ID format' },
        { status: 400 }
      );
    }

    // Verify authentication - use route client that reads cookies
    const supabase = await createRouteClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check rate limit - 10 updates per hour per user
    const rateLimitResult = rateLimiters.commentUpdate(user.id);
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

    // Verify ownership - check that the comment belongs to the current user
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    if (fetchError || !existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (existingComment.author_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to update this comment' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { content } = body;

    // Validate input
    if (!content) {
      return NextResponse.json(
        { error: 'content is required' },
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

    // Update comment - pass authenticated supabase client
    const updatedComment = await updateComment(supabase, commentId, sanitizedContent);

    if (!updatedComment) {
      return NextResponse.json(
        { error: 'Failed to update comment' },
        { status: 500 }
      );
    }

    // Revalidate blog pages to show updated comment
    revalidatePath('/blog');
    revalidatePath('/');

    return NextResponse.json(
      { data: updatedComment },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/comments/[id]
 * Delete a comment (requires authentication + ownership)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15 requirement)
    const { id: commentId } = await params;

    // Validate UUID format to prevent malicious input
    if (!isValidUUID(commentId)) {
      return NextResponse.json(
        { error: 'Invalid comment ID format' },
        { status: 400 }
      );
    }

    // Verify authentication - use route client that reads cookies
    const supabase = await createRouteClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check rate limit - 20 deletions per hour per user
    const rateLimitResult = rateLimiters.commentDelete(user.id);
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

    // Verify ownership - check that the comment belongs to the current user
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    if (fetchError || !existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (existingComment.author_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this comment' },
        { status: 403 }
      );
    }

    // Delete comment - pass authenticated supabase client
    const success = await deleteComment(supabase, commentId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete comment' },
        { status: 500 }
      );
    }

    // Revalidate blog pages to remove deleted comment
    revalidatePath('/blog');
    revalidatePath('/');

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
