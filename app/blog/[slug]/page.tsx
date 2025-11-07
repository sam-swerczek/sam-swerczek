import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from '@/lib/supabase/queries';
import { getConfigObject, type EngineeringSocialConfig } from '@/lib/supabase/config-helpers';
import PostContent from '@/components/blog/PostContent';
import TagsList from '@/components/blog/TagsList';
import CommentSection from '@/components/blog/CommentSection';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Disable caching for blog post pages to show fresh content
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Sam Swerczek',
    };
  }

  return {
    title: `${post.title} | Sam Swerczek`,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt,
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: ['Sam Swerczek'],
      tags: post.tags,
    },
  };
}

// Generate static params for all posts (Next.js optimization)
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  // Get related posts and social links
  const [relatedPosts, social] = await Promise.all([
    getRelatedPosts(post.id, post.tags || [], 3),
    getConfigObject<EngineeringSocialConfig>(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">

        {/* Article Header - Dramatic & Center Aligned */}
        <article>
          <header className="pt-12 md:pt-16 mb-16 md:mb-20 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-text-primary mb-8 leading-tight font-montserrat max-w-4xl mx-auto">
              {post.title}
            </h1>

            {/* Metadata - Centered */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6 text-text-secondary/70">
              <time dateTime={post.published_at || undefined} className="text-sm">
                {publishedDate}
              </time>
              <span className="text-text-secondary/30">•</span>
              <span className="text-sm">Sam Swerczek</span>
            </div>

            {/* Tags - Centered */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex justify-center mb-8">
                <TagsList tags={post.tags} />
              </div>
            )}

            {/* Excerpt - Centered & Dramatic */}
            {post.excerpt && (
              <p className="text-xl md:text-2xl text-text-secondary/80 font-light max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
                {post.excerpt}
              </p>
            )}

            {/* Decorative Divider */}
            <div className="mt-12 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-accent-teal/40 to-transparent" />
          </header>

          {/* Article Content */}
          <PostContent content={post.content} />
        </article>

        {/* Comments Section */}
        <div id="comments">
          <CommentSection postId={post.id} />
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-800">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-background-secondary rounded-lg p-6 border border-gray-800 hover:border-accent-blue transition-all duration-200 h-full">
                    <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent-blue transition-colors duration-200">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3 whitespace-pre-line">
                      {relatedPost.excerpt}
                    </p>
                    <div className="text-sm text-accent-blue group-hover:text-accent-teal transition-colors duration-200">
                      Read more →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-text-secondary">
                Thanks for reading! Connect with me on LinkedIn or GitHub.
              </p>
            </div>
            <div className="flex gap-4">
              {social.linkedin_url && (
                <a
                  href={social.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 border border-gray-700 text-text-primary rounded-lg font-medium hover:border-accent-blue hover:text-accent-blue transition-colors duration-200"
                >
                  LinkedIn
                </a>
              )}
              {social.github_url && (
                <a
                  href={social.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 border border-gray-700 text-text-primary rounded-lg font-medium hover:border-accent-teal hover:text-accent-teal transition-colors duration-200"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
