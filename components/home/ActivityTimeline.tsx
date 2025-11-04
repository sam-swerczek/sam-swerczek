'use client';

import Link from 'next/link';
import { MusicIcon, CodeIcon, BookIcon } from '@/components/ui/icons';
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

  // Animation variants for music cards (fly in from left)
  const musicCardVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -100,
      scale: shouldReduceMotion ? 1 : 0.92,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 1.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  // Animation variants for engineering cards (fly in from right)
  const engineeringCardVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : 100,
      scale: shouldReduceMotion ? 1 : 0.92,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 1.4,
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
    <section className="relative pt-36 md:pt-48 pb-24 md:pb-36 bg-background-primary overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-background-navy via-[rgb(21,23,25)] to-background-primary/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent-gold/8" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-[900px] mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  duration: shouldReduceMotion ? 0.3 : 2.4,
                  delay: shouldReduceMotion ? 0 : 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              },
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary font-montserrat mb-3">
              Recent Activity
            </h2>
            <p className="text-base md:text-lg text-text-secondary/80 font-light">
              Explore my thoughts on music, engineering, and everything in between
            </p>
          </motion.div>

          {/* Timeline items */}
          <div className="space-y-2">
            {timelineItems.map((item, index) => {
              const isMusicCategory = item.category === 'music';
              const IconComponent = isMusicCategory ? MusicIcon : CodeIcon;

              return (
                <motion.article
                  key={item.id}
                  className="relative"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={isMusicCategory ? musicCardVariants : engineeringCardVariants}
                  custom={index}
                  transition={{ delay: Math.min(index, 3) * 0.1 }}
                >
                  <Link
                    href={`/blog/${item.slug}`}
                    className="group block py-8 px-4 -mx-4 rounded-lg hover:bg-background-secondary/30 transition-all duration-300"
                  >
                    <div className="flex gap-4 items-start">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isMusicCategory
                          ? 'bg-accent-blue/20 text-accent-blue group-hover:bg-accent-blue/30'
                          : 'bg-accent-teal/20 text-accent-teal group-hover:bg-accent-teal/30'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1.5">
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-text-primary font-montserrat group-hover:text-accent-teal transition-colors">
                          {item.shortTitle}
                        </h3>

                        {/* Date */}
                        <time dateTime={item.published_at} className="block text-xs text-text-secondary/70">
                          {formatDate(item.published_at)}
                        </time>

                        {/* Excerpt */}
                        <p className="text-sm text-text-secondary/80 leading-relaxed line-clamp-2 font-light">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>

          {/* View All link */}
          <div className="text-center mt-16">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-transparent hover:bg-accent-teal/10 border border-text-secondary/20 hover:border-text-secondary/40 transition-all duration-300 text-text-primary hover:text-accent-teal font-medium"
            >
              <span className="w-8 h-8 rounded-full bg-background-secondary/50 border border-accent-teal/30 group-hover:border-accent-teal/50 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                <BookIcon className="w-4 h-4 text-accent-teal/70 group-hover:text-accent-teal transition-colors duration-300" />
              </span>
              <span>Read the Blog</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
