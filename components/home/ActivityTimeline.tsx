import Link from 'next/link';
import { MusicIcon, CodeIcon, ArrowRightIcon } from '@/components/ui/icons';
import { getPublishedPosts } from '@/lib/supabase/queries';

interface MusicRelease {
  type: 'music';
  title: string;
  date: string;
  releaseType: 'single' | 'EP' | 'album';
  streamingUrl?: string;
}

interface BlogPost {
  type: 'blog';
  id: string;
  title: string;
  excerpt: string;
  published_at: string;
  slug: string;
}

type TimelineItem = MusicRelease | BlogPost;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default async function ActivityTimeline() {
  // Fetch blog posts
  const blogPosts = await getPublishedPosts({ limit: 3 });

  // Placeholder music releases - will be made dynamic later
  const musicReleases: MusicRelease[] = [
    {
      type: 'music',
      title: "Auburn Maine - Single",
      date: "2024-12-15",
      releaseType: "single",
      streamingUrl: "#"
    },
    {
      type: 'music',
      title: "Winter Reflections - EP",
      date: "2024-11-01",
      releaseType: "EP",
      streamingUrl: "#"
    }
  ];

  // Transform blog posts to timeline items
  const blogTimelineItems: BlogPost[] = blogPosts.map(post => ({
    type: 'blog',
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || '',
    published_at: post.published_at || post.created_at,
    slug: post.slug
  }));

  // Combine and sort by date
  const timelineItems: TimelineItem[] = [
    ...musicReleases,
    ...blogTimelineItems
  ].sort((a, b) => {
    const dateA = new Date(a.type === 'music' ? a.date : a.published_at);
    const dateB = new Date(b.type === 'music' ? b.date : b.published_at);
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 4); // Show only 4 most recent items

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
              {timelineItems.map((item, index) => {
                const isMusic = item.type === 'music';
                const date = isMusic ? item.date : item.published_at;

                return (
                  <div
                    key={index}
                    className="relative pl-16 md:pl-20 group"
                  >
                    {/* Icon indicator */}
                    <div className={`
                      absolute left-0 top-3 w-12 h-12 md:w-16 md:h-16
                      rounded-full
                      bg-background-secondary
                      ${isMusic ? 'border-2 border-accent-blue' : 'border-2 border-accent-teal'}
                      flex items-center justify-center
                      transition-all duration-300
                      group-hover:scale-110 group-hover:shadow-lg
                      ${isMusic ? 'group-hover:shadow-accent-blue/30' : 'group-hover:shadow-accent-teal/30'}
                    `}>
                      {isMusic ? (
                        <MusicIcon className="w-6 h-6 md:w-8 md:h-8 text-accent-blue" />
                      ) : (
                        <CodeIcon className="w-6 h-6 md:w-8 md:h-8 text-accent-teal" />
                      )}
                    </div>

                    {/* Content card */}
                    <div className={`
                      relative p-6
                      rounded-xl
                      bg-background-secondary/30
                      backdrop-blur-sm
                      ${isMusic ? 'border border-accent-blue/20 hover:border-accent-blue/40 hover:shadow-accent-blue/10' : 'border border-accent-teal/20 hover:border-accent-teal/40 hover:shadow-accent-teal/10'}
                      transition-all duration-300
                      hover:shadow-lg
                      hover:-translate-y-1
                    `}>
                      {/* Type badge and date */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                          ${isMusic ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30' : 'bg-accent-teal/10 text-accent-teal border border-accent-teal/30'}
                        `}>
                          {isMusic ? item.releaseType : 'Blog Post'}
                        </span>
                        <time className="text-sm text-text-secondary">
                          {formatDate(date)}
                        </time>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2 font-montserrat">
                        {item.title}
                      </h3>

                      {/* Description / Excerpt */}
                      {!isMusic && item.excerpt && (
                        <p className="text-text-secondary mb-4 line-clamp-2">
                          {item.excerpt}
                        </p>
                      )}

                      {/* Action link */}
                      {isMusic ? (
                        item.streamingUrl && (
                          <Link
                            href={item.streamingUrl}
                            className="inline-flex items-center gap-2 text-accent-blue hover:text-accent-blue/80 font-medium transition-colors"
                          >
                            Listen Now
                            <ArrowRightIcon className="w-4 h-4" />
                          </Link>
                        )
                      ) : (
                        <Link
                          href={`/blog/${item.slug}`}
                          className="inline-flex items-center gap-2 text-accent-teal hover:text-accent-teal/80 font-medium transition-colors"
                        >
                          Read More
                          <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
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
