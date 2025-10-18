'use client';

import { useState } from 'react';
import type { Post } from '@/lib/types';
import PostCard from '@/components/blog/PostCard';
import TagFilter from '@/components/blog/TagFilter';
import { FilterIcon, StarIcon } from '@/components/ui/icons';
import { EngineeringSocialConfig } from '@/lib/supabase/config-helpers';

interface BlogClientProps {
  initialPosts: Post[];
  allTags: string[];
  social: EngineeringSocialConfig;
}

export default function BlogClient({ initialPosts, allTags, social }: BlogClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  return (
    <div className="min-h-screen relative">
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
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                      <div className="inline-flex items-center gap-3 text-accent-gold group-hover:text-accent-teal transition-colors duration-300 font-bold text-lg">
                        <span>Dive into the article</span>
                        <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                      </div>

                      {posts[0].tags && posts[0].tags.length > 1 && (
                        <div className="hidden md:flex gap-2">
                          {posts[0].tags.slice(1, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-xs font-medium bg-background-primary/50 text-text-secondary border border-gray-700 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Collapsible Filter Section */}
        {posts.length > 1 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-text-primary">
                {selectedTag ? `Posts about "${selectedTag}"` : 'All Articles'}
              </h2>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="group flex items-center gap-2 px-4 py-2 bg-background-secondary/50 hover:bg-background-secondary border border-gray-800 hover:border-gray-700 rounded-lg transition-all duration-200"
              >
                <FilterIcon className="w-4 h-4" />
                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                  Filter by Topic
                </span>
                {selectedTag && (
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-accent-blue/20 text-accent-blue rounded-full">
                    {selectedTag}
                  </span>
                )}
              </button>
            </div>

            {isFilterOpen && (
              <div className="mb-6 p-4 bg-background-secondary/30 border border-gray-800 rounded-lg">
                <TagFilter tags={sortedTags} selectedTag={selectedTag} onTagChange={setSelectedTag} />
              </div>
            )}
          </div>
        )}

        {/* Posts List - Skip first post if showing featured */}
        {posts.length > 1 && (
          <div className="flex flex-col gap-6">
            {posts.slice(1).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
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
