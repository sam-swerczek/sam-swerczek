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
    <Card hover className="h-full flex flex-col">
      <CardContent className="flex-grow pt-6">
        <Link href={`/blog/${post.slug}`} className="group">
          <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:text-accent-blue transition-colors duration-200">
            {post.title}
          </h3>
        </Link>

        <div className="flex items-center text-sm text-text-secondary mb-4">
          <time dateTime={post.published_at || undefined}>
            {publishedDate}
          </time>
        </div>

        <p className="text-text-secondary leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <TagsList tags={post.tags} />
        )}
      </CardContent>

      <CardFooter>
        <Link
          href={`/blog/${post.slug}`}
          className="text-accent-blue hover:text-accent-teal transition-colors duration-200 font-medium inline-flex items-center group"
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
      </CardFooter>
    </Card>
  );
}
