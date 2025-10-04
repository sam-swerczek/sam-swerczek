import Link from 'next/link';
import { Post } from '@/lib/types';
import Card, { CardContent, CardFooter } from '@/components/ui/Card';
import TagsList from './TagsList';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card hover className="w-full h-full transition-all duration-300 group-hover:shadow-xl group-hover:border-accent-blue/50">
        <CardContent className="pt-6 pb-6">
          <div className="mb-4">
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 group-hover:text-accent-blue transition-colors duration-200">
              {post.title}
            </h3>

            <div className="flex items-center gap-3 text-sm text-text-secondary/80 mb-3">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={post.published_at || undefined}>
                  {publishedDate}
                </time>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mb-4">
                <TagsList tags={post.tags} compact />
              </div>
            )}
          </div>

          <p className="text-text-secondary leading-relaxed mb-6 text-base md:text-lg line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-accent-blue group-hover:text-accent-teal transition-colors duration-200 font-semibold inline-flex items-center text-sm">
              Read Article
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
            <div className="flex items-center gap-1.5 text-text-secondary/60 text-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>5 min read</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
