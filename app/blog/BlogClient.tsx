'use client';

import { useState } from 'react';
import type { Post } from '@/lib/types';
import TagFilter from '@/components/blog/TagFilter';
import { FilterIcon, StarIcon, CodeIcon, MusicIcon } from '@/components/ui/icons';
import { EngineeringSocialConfig } from '@/lib/supabase/config-helpers';
import { motion, useReducedMotion } from 'framer-motion';

interface BlogClientProps {
  initialPosts: Post[];
  allTags: string[];
  social: EngineeringSocialConfig;
  commentCounts: Record<string, number>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function BlogClient({ initialPosts, allTags, social, commentCounts }: BlogClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Calculate tag counts for sorting by popularity
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = initialPosts.filter(post => post.tags?.includes(tag)).length;
    return acc;
  }, {} as Record<string, number>);

  // Sort tags by count (most popular first)
  const sortedTags = [...allTags].sort((a, b) => tagCounts[b] - tagCounts[a]);

  // Filter posts by selected tag
  const posts = selectedTag
    ? initialPosts.filter((post) => post.tags?.includes(selectedTag))
    : initialPosts;

  // Determine if post is music-related
  const isMusicPost = (post: Post): boolean => {
    const type = post.type?.toLowerCase() || '';
    return type.includes('music') || type.includes('song') || type.includes('performance') || type.includes('release');
  };

  return (
    <div className="min-h-screen relative animate-theater-reveal">
      {/* Subtle tech-themed background - right side only, fades to left and bottom */}
      <div className="absolute top-0 left-0 right-0 h-screen -z-10 overflow-hidden pointer-events-none hidden md:block">
        {/* Right side - Engineering */}
        <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80)',
              filter: 'blur(3px) brightness(0.6)',
            }}
          />
          {/* Gradient fade to left */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background-primary" />
          {/* Gradient fade to bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-primary/50 via-60% to-background-primary" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Featured Post - Spotlight Card */}
          {posts.length > 0 && (
            <div className="mb-20">
              <div className="relative">
                {/* Featured badge - top right */}
                <div className="absolute -top-3 right-6 z-20">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-gold to-accent-gold/80 rounded-full shadow-lg">
                    <StarIcon className="w-4 h-4 text-background-primary" />
                    <span className="text-sm font-bold text-background-primary uppercase tracking-wide">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Spotlight card */}
                <a
                  href={`/blog/${posts[0].slug}`}
                  className="block group"
                  aria-label="Featured article"
                >
                  <div className="relative rounded-2xl border-[3px] border-accent-gold overflow-hidden shadow-2xl shadow-accent-gold/20 hover:shadow-accent-gold/40 transition-all duration-500 hover:-translate-y-1">
                    {/* Background with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-background-secondary to-background-primary" />

                    {/* Subtle pattern overlay */}
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(74, 158, 255, 0.3) 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                      }}
                    />

                    {/* Content */}
                    <div className="relative p-8 md:p-12">
                      {/* Category/Topic label */}
                      {posts[0].tags && posts[0].tags.length > 0 && (
                        <div className="inline-block px-3 py-1 bg-accent-blue/20 border border-accent-blue/40 rounded-full mb-6">
                          <span className="text-xs font-semibold text-accent-blue uppercase tracking-wider">
                            {posts[0].tags[0]}
                          </span>
                        </div>
                      )}

                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 group-hover:text-accent-gold transition-colors duration-300 leading-tight">
                        {posts[0].title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 text-accent-teal">📅</span>
                          <time className="text-text-primary/80">
                            {posts[0].published_at
                              ? new Date(posts[0].published_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : ''}
                          </time>
                        </div>
                        <div className="w-1 h-1 bg-accent-teal rounded-full" />
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 text-accent-teal">⏱️</span>
                          <span className="text-text-primary/80">5 min read</span>
                        </div>
                      </div>

                      <p className="text-xl text-text-primary/90 leading-relaxed mb-10 line-clamp-4 max-w-4xl">
                        {posts[0].excerpt}
                      </p>

                      {/* CTA with strong visual */}
                      <div className="flex items-center pt-6 border-t border-gray-700">
                        <div className="inline-flex items-center gap-3 text-accent-gold group-hover:text-accent-teal transition-colors duration-300 font-bold text-lg">
                          <span>Dive into the article</span>
                          <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* Header and Filter Section */}
          {posts.length > 1 && (
            <motion.div
              className="mb-12 pt-24 md:pt-32"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: shouldReduceMotion ? 0.3 : 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                },
              }}
            >
              {/* Header with gradient underline */}
              <div className="mb-8">
                {/* Centered Header */}
                <div className="text-center mb-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-text-primary font-montserrat mb-2">
                    {selectedTag ? (
                      <>
                        <span className="text-text-secondary/60 font-normal text-2xl md:text-3xl">Topic: </span>
                        <span className="text-accent-teal">{selectedTag}</span>
                      </>
                    ) : (
                      'Latest Writings'
                    )}
                  </h2>

                  {/* Sub-header */}
                  <p className="text-base text-text-secondary/70 font-light">
                    {selectedTag
                      ? 'Explore posts on this topic'
                      : 'Deep dives into music production, software engineering, and creative process'}
                  </p>
                </div>

                {/* Gradient underline */}
                <div className="h-1 w-full bg-gradient-to-r from-accent-teal/40 via-accent-blue/20 to-transparent rounded-full mb-4"></div>

                {/* Article count with filter */}
                <div className="flex items-center justify-center gap-3">
                  <p className="text-sm text-text-secondary/70">
                    {posts.length - 1} {posts.length - 1 === 1 ? 'article' : 'articles'}
                    {selectedTag && ' in this topic'}
                  </p>

                  {/* Separator */}
                  <span className="text-text-secondary/30">•</span>

                  {/* Filter count - matching article count style */}
                  {allTags.length > 0 && (
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="text-sm text-text-secondary/70 hover:text-accent-teal transition-colors duration-200 cursor-pointer"
                      aria-label="Toggle filter"
                    >
                      {selectedTag ? '1' : '0'} {selectedTag ? 'filter' : 'filters'}
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Panel */}
              {isFilterOpen && (
                <div className="mb-8 p-5 bg-gradient-to-br from-background-secondary/40 to-background-secondary/20 border border-gray-800/50 rounded-xl backdrop-blur-sm">
                  <TagFilter tags={sortedTags} selectedTag={selectedTag} onTagChange={setSelectedTag} />
                </div>
              )}
            </motion.div>
          )}

          {/* Posts List - Enhanced Card Style (Skip first post as it's featured) */}
          {posts.length > 1 && (
            <div className="space-y-4">
              {posts.slice(1).map((post, index) => {
                const isMusic = isMusicPost(post);
                const IconComponent = isMusic ? MusicIcon : CodeIcon;

                return (
                  <motion.article
                    key={post.id}
                    className="relative"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                      hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: shouldReduceMotion ? 0.3 : 0.6,
                          delay: shouldReduceMotion ? 0 : Math.min(index * 0.1, 0.3),
                          ease: [0.25, 0.46, 0.45, 0.94],
                        },
                      },
                    }}
                  >
                    <a
                      href={`/blog/${post.slug}`}
                      className="group block p-6 rounded-xl border border-gray-800/50 hover:border-accent-teal/40 bg-background-secondary/20 hover:bg-background-secondary/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent-teal/10"
                    >
                      <div className="flex gap-5 items-start">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isMusic
                            ? 'bg-accent-blue/20 text-accent-blue group-hover:bg-accent-blue/30 group-hover:scale-110'
                            : 'bg-accent-teal/20 text-accent-teal group-hover:bg-accent-teal/30 group-hover:scale-110'
                        }`}>
                          <IconComponent className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          {/* Header with Title and Tags */}
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="text-xl font-semibold text-text-primary font-montserrat group-hover:text-accent-teal transition-colors leading-tight">
                                {post.short_title || post.title}
                              </h3>

                              {/* Call to action - visible on hover */}
                              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="inline-flex items-center gap-2 text-accent-teal text-sm font-medium">
                                  Read Article
                                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                </span>
                              </div>
                            </div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                                      isMusic
                                        ? 'bg-accent-blue/10 text-accent-blue/90 border border-accent-blue/20'
                                        : 'bg-accent-teal/10 text-accent-teal/90 border border-accent-teal/20'
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Excerpt */}
                          <p className="text-base text-text-secondary/90 leading-relaxed line-clamp-3 font-light">
                            {post.excerpt}
                          </p>

                          {/* Meta information */}
                          <div className="flex items-center gap-4 text-sm text-text-secondary/70">
                            <time dateTime={post.published_at || post.created_at} className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(post.published_at || post.created_at)}
                            </time>
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              5 min read
                            </span>
                            {commentCounts[post.id] > 0 && (
                              <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {commentCounts[post.id]} {commentCounts[post.id] === 1 ? 'comment' : 'comments'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </a>
                  </motion.article>
                );
              })}
            </div>
          )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">No posts found. Check back soon!</p>
          </div>
        )}

        {/* Social Links Section */}
        <div className="mt-20 pt-12 border-t border-gray-800">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-text-primary mb-2">Want to connect?</h3>
              <p className="text-text-secondary">Find me on LinkedIn or check out my projects on GitHub.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
              {social.linkedin_url && (
                <a
                  href={social.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 px-6 py-4 bg-background-secondary border border-text-secondary/30 rounded-lg transition-all duration-300 hover:border-transparent hover:scale-105 hover:shadow-lg hover:bg-blue-700 flex-1 min-w-[140px]"
                  aria-label="LinkedIn"
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </span>
                  <span className="font-medium text-sm sm:text-base">LinkedIn</span>
                </a>
              )}
              {social.github_url && (
                <a
                  href={social.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 px-6 py-4 bg-background-secondary border border-text-secondary/30 rounded-lg transition-all duration-300 hover:border-transparent hover:scale-105 hover:shadow-lg hover:bg-gray-700 flex-1 min-w-[140px]"
                  aria-label="GitHub"
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </span>
                  <span className="font-medium text-sm sm:text-base">GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
