'use client';

import { useState } from 'react';
import type { Post } from '@/lib/types';
import PostCard from '@/components/blog/PostCard';
import TagFilter from '@/components/blog/TagFilter';

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
    <div className="container mx-auto px-4 py-16">
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm">{initialPosts.length} {initialPosts.length === 1 ? 'Article' : 'Articles'}</span>
            </div>
            <span className="text-text-secondary/40">•</span>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-sm">{allTags.length} {allTags.length === 1 ? 'Topic' : 'Topics'}</span>
            </div>
          </div>
        </div>

        {/* Featured Post - First Post */}
        {posts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-accent-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
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
  );
}
