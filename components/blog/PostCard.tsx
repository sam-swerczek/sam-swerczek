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
    <Card hover className="w-full">
      <CardContent className="pt-6 pb-6">
        <div className="mb-4">
          <Link href={`/blog/${post.slug}`} className="group">
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2 group-hover:text-accent-blue transition-colors duration-200">
              {post.title}
            </h3>
          </Link>

          <div className="flex items-center text-sm text-text-secondary mb-2">
            <time dateTime={post.published_at || undefined}>
              {publishedDate}
            </time>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div>
              <TagsList tags={post.tags} compact />
            </div>
          )}
        </div>

        <p className="text-text-secondary leading-relaxed mb-4 text-base md:text-lg">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="text-accent-blue hover:text-accent-teal transition-colors duration-200 font-medium inline-flex items-center group text-sm"
        >
          Read More
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </CardContent>
    </Card>
  );
}
