import Link from 'next/link';
import { Post } from '@/lib/types';
import Card, { CardContent, CardFooter } from '@/components/ui/Card';
import TagsList from './TagsList';
import { CalendarIcon, ClockIcon, ArrowRightIcon, MessageIcon } from '@/components/ui/icons';

interface PostCardProps {
  post: Post;
  commentCount?: number;
}

export default function PostCard({ post, commentCount }: PostCardProps) {
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
                <CalendarIcon className="w-4 h-4" />
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
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
            <div className="flex items-center gap-3">
              {/* Comment count badge */}
              {commentCount !== undefined && commentCount > 0 && (
                <div
                  className="flex items-center gap-1.5 bg-accent-blue/20 border border-accent-blue/40 rounded-full px-2.5 py-1 text-xs text-accent-blue"
                  aria-label={`${commentCount} comment${commentCount === 1 ? '' : 's'}`}
                >
                  <MessageIcon className="w-3.5 h-3.5" />
                  <span className="font-medium">{commentCount}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-text-secondary/60 text-xs">
                <ClockIcon className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
