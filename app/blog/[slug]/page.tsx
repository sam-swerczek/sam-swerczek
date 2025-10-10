import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPublishedPosts, getRelatedPosts, getSiteConfig } from '@/lib/supabase/queries';
import PostContent from '@/components/blog/PostContent';
import TagsList from '@/components/blog/TagsList';

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

  // Get related posts and social links using Supabase query
  const [relatedPosts, siteConfig] = await Promise.all([
    getRelatedPosts(post.id, post.tags || [], 3),
    getSiteConfig(),
  ]);

  const linkedinUrl = siteConfig.find(c => c.key === 'linkedin_url')?.value;
  const githubUrl = siteConfig.find(c => c.key === 'github_url')?.value;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-accent-blue hover:text-accent-teal transition-colors duration-200 mb-8 group"
        >
          <svg
            className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-text-secondary">
              <time dateTime={post.published_at || undefined} className="text-sm md:text-base">
                {publishedDate}
              </time>
              <span className="text-text-secondary/50">•</span>
              <span className="text-sm md:text-base">By Sam Swerczek</span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <TagsList tags={post.tags} className="mb-8" />
            )}

            {post.excerpt && (
              <p className="text-xl text-text-secondary italic border-l-4 border-accent-blue pl-6 py-2">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Article Content */}
          <PostContent content={post.content} />
        </article>

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
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3">
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
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 border border-gray-700 text-text-primary rounded-lg font-medium hover:border-accent-blue hover:text-accent-blue transition-colors duration-200"
                >
                  LinkedIn
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
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
