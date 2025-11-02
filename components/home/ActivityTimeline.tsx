'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@/components/ui/icons';
import { Post } from '@/lib/types';
import { motion, useReducedMotion } from 'framer-motion';

type ActivityCategory = 'engineering' | 'music';

interface TimelineItem {
  type: 'blog' | 'music_release' | 'project_launch' | 'music_video' | 'live_performance';
  category: ActivityCategory;
  id: string;
  title: string;
  shortTitle: string;
  activityType: string;
  excerpt: string;
  published_at: string;
  slug: string;
  commentCount: number;
  featured: boolean;
  featuredImageUrl: string | null;
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
  const shouldReduceMotion = useReducedMotion();

  // Animation variants for header
  const headerVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -50,
      scale: shouldReduceMotion ? 1 : 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  // Animation variants for music cards (fly in from left)
  const musicCardVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -40,
      scale: shouldReduceMotion ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  // Animation variants for engineering cards (fly in from right)
  const engineeringCardVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : 40,
      scale: shouldReduceMotion ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  // Determine category based on post type
  const getCategoryFromType = (type: string): ActivityCategory => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('music') || lowerType.includes('song') || lowerType.includes('performance') || lowerType.includes('release')) {
      return 'music';
    }
    return 'engineering';
  };

  // Generate intelligent CTA text based on activity type
  const getCtaText = (type: string): string => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('music video') || lowerType.includes('video')) {
      return 'Watch Video';
    }
    if (lowerType.includes('song') || lowerType.includes('music release')) {
      return 'Listen Now';
    }
    if (lowerType.includes('performance') || lowerType.includes('live')) {
      return 'Watch Performance';
    }
    if (lowerType.includes('tutorial')) {
      return 'Read Tutorial';
    }
    return 'Read Post';
  };

  // Extract YouTube video ID from URL
  const extractYouTubeFromContent = (content: string): string | null => {
    const iframeMatch = content.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (iframeMatch && iframeMatch[1]) {
      return iframeMatch[1];
    }
    const linkMatch = content.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (linkMatch && linkMatch[1]) {
      return linkMatch[1];
    }
    return null;
  };

  // Transform blog posts to timeline items
  const blogTimelineItems: TimelineItem[] = blogPosts.map(post => {
    const youtubeVideoId = extractYouTubeFromContent(post.content);
    const mediaUrl = youtubeVideoId ? youtubeVideoId : post.featured_image_url || null;

    return {
      type: 'blog',
      category: getCategoryFromType(post.type),
      id: post.id,
      title: post.title,
      shortTitle: post.short_title || post.title,
      activityType: post.type || 'blog post',
      excerpt: post.excerpt || '',
      published_at: post.published_at || post.created_at,
      slug: post.slug,
      commentCount: commentCounts[post.id] || 0,
      featured: post.featured,
      featuredImageUrl: mediaUrl
    };
  });

  const timelineItems = [...blogTimelineItems]
    .sort((a, b) => {
      const dateA = new Date(a.published_at);
      const dateB = new Date(b.published_at);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 4);

  return (
    <section className="relative py-16 md:py-20 bg-background-primary overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-background-navy via-[rgb(21,23,25)] to-background-primary/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent-gold/8" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-[900px] mx-auto">
          {/* Section heading */}
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={headerVariants}
          >
            <h2 className="text-4xl font-bold text-text-primary font-montserrat mb-4">
              Recent Activity
            </h2>
            <p className="text-lg text-text-secondary font-light">
              Latest music releases and engineering insights
            </p>
          </motion.div>

          {/* Timeline items */}
          <div className="space-y-8">
            {timelineItems.map((item, index) => {
              const isMusicCategory = item.category === 'music';

              return (
                <motion.article
                  key={item.id}
                  className={`
                    relative pl-6
                    border-l-4 ${isMusicCategory ? 'border-accent-blue/60' : 'border-accent-teal/60'}
                  `}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={isMusicCategory ? musicCardVariants : engineeringCardVariants}
                  custom={index}
                  transition={{ delay: Math.min(index, 3) * 0.1 }}
                >
                  <Link
                    href={`/blog/${item.slug}`}
                    className="block hover:opacity-90 transition-opacity"
                  >
                    <div className="space-y-2">
                      {/* Title */}
                      <h3 className="text-2xl font-bold text-text-primary font-montserrat hover:text-accent-teal transition-colors">
                        {item.shortTitle}
                      </h3>

                      {/* Date */}
                      <time dateTime={item.published_at} className="block text-sm text-text-secondary">
                        {formatDate(item.published_at)}
                      </time>

                      {/* Excerpt */}
                      <p className="text-text-secondary leading-relaxed line-clamp-2 font-light">
                        {item.excerpt}
                      </p>

                      {/* CTA */}
                      <div className="pt-2">
                        <span className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                          isMusicCategory
                            ? 'text-accent-blue hover:text-accent-blue/80'
                            : 'text-accent-teal hover:text-accent-teal/80'
                        }`}>
                          {getCtaText(item.activityType)}
                          <ArrowRightIcon className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>

          {/* View All link */}
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-background-secondary/50 hover:bg-accent-teal/10 border border-accent-teal/30 hover:border-accent-teal/60 transition-all duration-300 text-text-primary hover:text-accent-teal font-medium"
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
