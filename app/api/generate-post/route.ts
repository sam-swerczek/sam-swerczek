import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { generateSlug } from '@/lib/utils/slugify';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/utils/rate-limiter';

/**
 * POST /api/generate-post
 *
 * Generates a blog post draft using Claude AI based on a user-provided topic/prompt.
 *
 * Request body:
 * - prompt: string (required) - The topic or prompt for the blog post
 *
 * Response:
 * - title: string - Generated engaging title
 * - slug: string - SEO-friendly slug (auto-generated from title)
 * - excerpt: string - Brief summary (2-3 sentences)
 * - content: string - Full blog post content in Markdown
 * - tags: string[] - Suggested tags (3-5)
 * - metaDescription: string - SEO meta description
 */
export async function POST(request: NextRequest) {
  try {
    // Server-side authentication check
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to generate blog posts.' },
        { status: 401 }
      );
    }

    // Rate limiting: 10 requests per hour per IP (this is expensive!)
    const ip = getClientIp(request);
    const isAllowed = rateLimit(
      ip,
      RATE_LIMITS.BLOG_GENERATION.endpoint,
      RATE_LIMITS.BLOG_GENERATION.maxRequests,
      RATE_LIMITS.BLOG_GENERATION.windowMs
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. You can generate up to 10 posts per hour. Please try again later.' },
        { status: 429 }
      );
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured. Please add it to your .env.local file.' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Create the message to Claude
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are a professional technical writer helping to create a blog post for a software engineer's personal website.

Topic/Prompt: ${prompt}

Please generate a comprehensive blog post with the following requirements:

1. **Title**: Create an engaging, SEO-friendly title that captures attention and clearly conveys the topic. Make it compelling but professional.

2. **Excerpt**: Write a brief summary (2-3 sentences) that hooks the reader and makes them want to read more. This will appear on listing pages.

3. **Meta Description**: Write a concise SEO meta description (150-160 characters) optimized for search engines.

4. **Content**: Write a detailed, well-structured blog post in Markdown format. The content should:
   - Be 600-1000 words
   - Include proper headings (##, ###) for structure
   - Use code blocks with language tags when showing code examples
   - Include bullet points or numbered lists where appropriate
   - Be technically accurate and insightful
   - Have a clear introduction, body, and conclusion
   - Be written in a friendly yet professional tone

5. **Tags**: Suggest 3-5 relevant tags (lowercase, single words or hyphenated phrases like "typescript", "web-development", "best-practices")

IMPORTANT: Respond with ONLY a valid JSON object. Make sure all newlines in the content field are properly escaped as \\n. Do NOT use markdown code blocks. Format:
{
  "title": "Your engaging title here",
  "excerpt": "Your 2-3 sentence excerpt here",
  "metaDescription": "Your 150-160 character meta description here",
  "content": "Your full markdown content with \\n for newlines",
  "tags": ["tag1", "tag2", "tag3"]
}`,
        },
      ],
    });

    // Extract the response text
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    if (!responseText) {
      throw new Error('No response from Claude');
    }

    // Parse the JSON response
    // Claude sometimes wraps JSON in markdown code blocks or adds extra text
    let jsonText = responseText.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    // Try to extract JSON if there's extra text before/after
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    let generatedPost;
    try {
      // Parse with special handling for newlines in strings
      generatedPost = JSON.parse(jsonText);
    } catch (parseError) {
      // If normal parsing fails, try to fix common issues
      try {
        // Sometimes Claude includes unescaped newlines - try to fix them
        const fixedJson = jsonText.replace(/("\w+":\s*"[^"]*)"(\s+)/g, '$1\\n$2');
        generatedPost = JSON.parse(fixedJson);
      } catch (secondError) {
        console.error('Failed to parse Claude response:', jsonText.substring(0, 500));
        throw new Error('Invalid JSON response from Claude. Please try again.');
      }
    }

    // Validate the response has required fields
    if (!generatedPost.title || !generatedPost.excerpt || !generatedPost.content || !generatedPost.tags) {
      throw new Error('Incomplete response from Claude. Missing required fields.');
    }

    // Generate slug from title using shared utility
    const slug = generateSlug(generatedPost.title);

    // Return the generated post data
    return NextResponse.json({
      title: generatedPost.title,
      slug: slug,
      excerpt: generatedPost.excerpt,
      content: generatedPost.content,
      tags: Array.isArray(generatedPost.tags) ? generatedPost.tags : [],
      metaDescription: generatedPost.metaDescription || generatedPost.excerpt.slice(0, 160),
    });

  } catch (error) {
    console.error('Error generating post:', error);

    // Handle specific error types
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate post' },
      { status: 500 }
    );
  }
}
