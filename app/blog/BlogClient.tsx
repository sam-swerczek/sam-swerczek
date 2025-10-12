'use client';

import { useState } from 'react';
import type { Post } from '@/lib/types';
import PostCard from '@/components/blog/PostCard';
import TagFilter from '@/components/blog/TagFilter';
import { FilterIcon, StarIcon, BookIcon, TagIcon } from '@/components/ui/icons';

interface BlogClientProps {
  initialPosts: Post[];
  allTags: string[];
}

export default function BlogClient({ initialPosts, allTags }: BlogClientProps) {
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
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 pb-2 bg-gradient-to-r from-text-primary via-accent-blue to-accent-teal bg-clip-text text-transparent">
            Meta-Engineering
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-8">
            Exploring abstractions, diving into the unknown, and discovering what&apos;s possible when we rethink how we build.
          </p>
          <div className="flex items-center justify-center gap-3 text-text-secondary/60">
            <div className="flex items-center gap-2">
              <BookIcon className="w-5 h-5" />
              <span className="text-sm">{initialPosts.length} {initialPosts.length === 1 ? 'Article' : 'Articles'}</span>
            </div>
            <span className="text-text-secondary/40">•</span>
            <div className="flex items-center gap-2">
              <TagIcon className="w-5 h-5" />
              <span className="text-sm">{allTags.length} {allTags.length === 1 ? 'Topic' : 'Topics'}</span>
            </div>
          </div>
        </div>

        {/* Featured Post - First Post */}
        {posts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <StarIcon className="w-5 h-5 text-accent-gold" />
              <h2 className="text-xl font-bold text-text-primary">Featured Article</h2>
            </div>
            <PostCard post={posts[0]} />
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Want to connect?</h3>
              <p className="text-text-secondary">Find me on LinkedIn or check out my projects on GitHub.</p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/in/samswerczek"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-accent-blue text-white rounded-lg font-medium hover:bg-accent-blue/90 transition-colors duration-200"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/samswerczek"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-700 text-text-primary rounded-lg font-medium hover:border-accent-teal hover:text-accent-teal transition-colors duration-200"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
