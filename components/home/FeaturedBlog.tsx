import Link from 'next/link';
import { getPublishedPosts } from '@/lib/supabase/queries';
import TagsList from '@/components/blog/TagsList';
import { ArrowRightIcon } from '@/components/ui/icons';

export default async function FeaturedBlog() {
  const posts = await getPublishedPosts();
  const featuredPost = posts[0]; // Get the most recent post

  if (!featuredPost) {
    return null; // Don't render if no posts
  }

  const publishedDate = featuredPost.published_at
    ? new Date(featuredPost.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <section className="relative py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-text-primary">
          Latest from the Blog
        </h2>

        <div className="relative">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-transparent to-accent-teal/5 rounded-2xl -z-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl -z-10" />

          <div className="bg-background-secondary/30 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-accent-blue/20">
            <div className="space-y-6">
              <div className="text-text-secondary text-lg leading-relaxed">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="font-bold text-text-primary hover:text-accent-blue transition-colors"
                >
                  {featuredPost.title}
                </Link>
                {' — '}
                {featuredPost.excerpt}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:justify-end">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-blue hover:bg-accent-teal text-white rounded-lg font-semibold transition-colors group"
                >
                  Read Article
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-background-secondary hover:bg-background-primary border border-accent-blue/30 hover:border-accent-blue text-text-primary rounded-lg font-semibold transition-colors"
                >
                  View All Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
