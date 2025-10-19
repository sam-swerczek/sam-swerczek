import Link from 'next/link';
import { CodeIcon, ArrowRightIcon, MessageIcon } from '@/components/ui/icons';
import { Post } from '@/lib/types';

interface BlogPost {
  type: 'blog';
  id: string;
  title: string;
  shortTitle: string;
  activityType: string;
  excerpt: string;
  published_at: string;
  slug: string;
  commentCount: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

interface ActivityTimelineProps {
  blogPosts: Post[];
  commentCounts: Record<string, number>;
}

export default function ActivityTimeline({ blogPosts, commentCounts }: ActivityTimelineProps) {

  // Transform blog posts to timeline items
  const blogTimelineItems: BlogPost[] = blogPosts.map(post => ({
    type: 'blog',
    id: post.id,
    title: post.title,
    shortTitle: post.short_title || post.title,
    activityType: post.type || 'blog post',
    excerpt: post.excerpt || '',
    published_at: post.published_at || post.created_at,
    slug: post.slug,
    commentCount: commentCounts[post.id] || 0
  }));

  // Sort by date and limit to 4 most recent
  const timelineItems = blogTimelineItems
    .sort((a, b) => {
      const dateA = new Date(a.published_at);
      const dateB = new Date(b.published_at);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 4);

  return (
    <section className="relative py-16 md:py-20 bg-background-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-[900px] mx-auto">
          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-primary font-montserrat mb-4">
              Recent Activity
            </h2>
            <p className="text-lg text-text-secondary">
              Latest music releases and engineering insights
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline connector line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-blue via-accent-teal to-transparent" />

            {/* Timeline items */}
            <div className="space-y-8">
              {timelineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative pl-14 md:pl-16 group"
                >
                  {/* Icon indicator - compact size */}
                  <div className="absolute left-0 top-2 w-10 h-10 rounded-full bg-background-secondary border-2 border-accent-teal flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent-teal/30">
                    <CodeIcon className="w-5 h-5 text-accent-teal" />
                  </div>

                  {/* Content card - compact design */}
                  <div className="relative p-4 rounded-lg bg-background-secondary/30 backdrop-blur-sm border border-accent-teal/20 hover:border-accent-teal/40 hover:shadow-accent-teal/10 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                    {/* Header: Type badge and date */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent-teal/10 text-accent-teal">
                        {item.activityType}
                      </span>
                      <time className="text-xs text-text-secondary">
                        {formatDate(item.published_at)}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-text-primary mb-1 line-clamp-2 font-montserrat">
                      {item.shortTitle}
                    </h3>

                    {/* Footer: Action link and comment count */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-text-secondary/10">
                      <Link
                        href={`/blog/${item.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm text-accent-teal hover:text-accent-teal/80 font-medium transition-colors"
                      >
                        Read More
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </Link>

                      {/* Comment count badge - always show */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-blue/20 border border-accent-blue/40 rounded-full text-xs font-medium text-accent-blue" aria-label={`${item.commentCount} ${item.commentCount === 1 ? 'comment' : 'comments'}`}>
                        <MessageIcon className="w-3.5 h-3.5" />
                        <span>{item.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View All link */}
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-background-secondary/50 hover:bg-accent-blue/10 border border-accent-blue/30 hover:border-accent-blue/60 transition-all duration-300 text-text-primary hover:text-accent-blue font-medium"
            >
              View All Activity
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
