'use client';

import Link from 'next/link';
import { CodeIcon, ArrowRightIcon, MessageIcon, MusicIcon, StarIcon } from '@/components/ui/icons';
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
  // Check for reduced motion preference
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
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // Animation variants for music cards (fly in from left)
  const musicCardVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -80,
      scale: shouldReduceMotion ? 1 : 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.34, 1.56, 0.64, 1] as const, // back-out easing
      },
    },
    exit: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -80,
      transition: {
        duration: 0.4,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Animation variants for engineering cards (fly in from right)
  const engineeringCardVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : 80,
      scale: shouldReduceMotion ? 1 : 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.34, 1.56, 0.64, 1] as const, // back-out easing
      },
    },
    exit: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : 80,
      transition: {
        duration: 0.4,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Determine category based on post type
  const getCategoryFromType = (type: string): ActivityCategory => {
    const lowerType = type.toLowerCase();
    // Music-related types appear on the left
    if (lowerType.includes('music') || lowerType.includes('song') || lowerType.includes('performance') || lowerType.includes('release')) {
      return 'music';
    }
    // Everything else (engineering, blog, etc.) appears on the right
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
    // Default for blog posts and other types
    return 'Read Post';
  };

  // Extract YouTube video ID from URL with strict validation
  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(?:[&?#]|$)/,
      /^([a-zA-Z0-9_-]{11})$/  // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        // Additional validation: ensure it's exactly 11 characters
        const videoId = match[1];
        if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          return videoId;
        }
      }
    }
    return null;
  };

  // Extract first YouTube video ID from post content HTML
  const extractYouTubeFromContent = (content: string): string | null => {
    // Match YouTube iframe embeds
    const iframeMatch = content.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (iframeMatch && iframeMatch[1]) {
      return iframeMatch[1];
    }

    // Match YouTube links in content
    const linkMatch = content.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (linkMatch && linkMatch[1]) {
      return linkMatch[1];
    }

    return null;
  };

  // Transform blog posts to timeline items
  const blogTimelineItems: TimelineItem[] = blogPosts.map(post => {
    // Try to extract YouTube video from content first
    const youtubeVideoId = extractYouTubeFromContent(post.content);

    // Use YouTube video ID if found, otherwise use featured_image_url
    const mediaUrl = youtubeVideoId
      ? youtubeVideoId  // Store just the video ID
      : post.featured_image_url || null;

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

  // In the future, you can add other activity types here:
  // const musicReleases: TimelineItem[] = [...];
  // const projectLaunches: TimelineItem[] = [...];
  // const musicVideos: TimelineItem[] = [...];
  // const livePerformances: TimelineItem[] = [...];

  // Combine all activities and sort by date
  const timelineItems = [...blogTimelineItems]
    .sort((a, b) => {
      const dateA = new Date(a.published_at);
      const dateB = new Date(b.published_at);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 4);

  return (
    <section className="relative py-16 md:py-20 bg-background-primary overflow-hidden">
      {/* Background gradient matching hero section bottom - navy left to orange right */}
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
            <p className="text-lg text-text-secondary">
              Latest music releases and engineering insights
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline items */}
            <div className="space-y-8">
              {timelineItems.map((item, index) => {
                // Determine positioning based on category (music left, engineering right)
                const isLeftSide = item.category === 'music';
                const isMusicCategory = item.category === 'music';

                return (
                  <motion.div
                    key={item.id}
                    className={`
                      relative group
                      ${/* Mobile: all items left-aligned with padding */ ''}
                      pl-14
                      ${/* Desktop: position based on category */ ''}
                      md:pl-0
                      ${isLeftSide
                        ? 'md:pr-[20%]'  // Music on left - wider cards (80% width)
                        : 'md:pl-[20%]'  // Engineering on right - wider cards (80% width)
                      }
                    `}
                    initial="hidden"
                    whileInView="visible"
                    exit="exit"
                    viewport={{
                      once: false,
                      amount: 0.25,
                      margin: '-100px'
                    }}
                    variants={isMusicCategory ? musicCardVariants : engineeringCardVariants}
                    custom={index}
                    transition={{
                      delay: Math.min(index, 2) * 0.12, // Stagger by 120ms, max 3 cards
                    }}
                  >
                    {/* Content card - clickable and compact design */}
                    <Link
                      href={`/blog/${item.slug}`}
                      className={`block relative px-6 py-4 rounded-lg bg-background-secondary/30 backdrop-blur-sm border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
                        isMusicCategory
                          ? 'border-accent-blue/20 hover:border-accent-blue/40 hover:shadow-accent-blue/10'
                          : 'border-accent-teal/20 hover:border-accent-teal/40 hover:shadow-accent-teal/10'
                      }`}
                    >
                      {/* Activity Type Tag */}
                      <div className="mb-3">
                        <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold ${
                          isMusicCategory
                            ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
                            : 'bg-accent-teal/10 text-accent-teal border border-accent-teal/30'
                        }`}>
                          {isMusicCategory ? (
                            <MusicIcon className="w-4 h-4" />
                          ) : (
                            <CodeIcon className="w-4 h-4" />
                          )}
                          {item.activityType}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-text-primary line-clamp-1 font-montserrat">
                          {item.shortTitle}
                        </h3>
                        {item.title !== item.shortTitle && (
                          <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                            {item.title}
                          </p>
                        )}
                      </div>

                      {/* Featured Media - YouTube embed or image */}
                      {item.featuredImageUrl && (() => {
                        const youtubeVideoId = getYouTubeVideoId(item.featuredImageUrl);

                        // Only render YouTube embed if video ID passes strict validation
                        if (youtubeVideoId && /^[a-zA-Z0-9_-]{11}$/.test(youtubeVideoId)) {
                          // Render YouTube embed (smaller with 40% aspect ratio)
                          return (
                            <div className="mb-3 relative w-full rounded-lg overflow-hidden bg-background-primary max-h-[180px]" style={{ paddingBottom: '40%' }}>
                              <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                                title={item.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          );
                        } else if (!youtubeVideoId && item.featuredImageUrl) {
                          // Render image only if it's not a video ID (smaller with max height)
                          return (
                            <div className="mb-3 relative w-full rounded-lg overflow-hidden max-h-[180px]">
                              <img
                                src={item.featuredImageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Metadata bar: Date + Featured indicator */}
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-text-secondary/10">
                        <time dateTime={item.published_at} className="text-xs text-text-secondary font-medium">
                          {formatDate(item.published_at)}
                        </time>
                        {item.featured && (
                          <>
                            <span className="text-text-secondary/30">•</span>
                            <div className="flex items-center gap-1">
                              <StarIcon className="w-3.5 h-3.5 text-accent-gold" aria-label="Featured post" />
                              <span className="text-xs text-accent-gold font-medium">Featured</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Footer: Simple CTA text link and comment count */}
                      <div className="flex items-center justify-between">
                        {/* Intelligent CTA text link */}
                        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                          isMusicCategory
                            ? 'text-accent-blue hover:text-accent-blue/80'
                            : 'text-accent-teal hover:text-accent-teal/80'
                        } transition-colors`}>
                          {getCtaText(item.activityType)}
                          <ArrowRightIcon className="w-3.5 h-3.5" />
                        </span>

                        {/* Comment count badge - clickable to comments section */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = `/blog/${item.slug}#comments`;
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-blue/20 border border-accent-blue/40 rounded-full text-xs font-medium text-accent-blue hover:bg-accent-blue/30 hover:border-accent-blue/60 transition-all duration-200 cursor-pointer"
                          aria-label={`${item.commentCount} ${item.commentCount === 1 ? 'comment' : 'comments'}`}
                        >
                          <MessageIcon className="w-3.5 h-3.5" />
                          <span>{item.commentCount}</span>
                        </button>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
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
