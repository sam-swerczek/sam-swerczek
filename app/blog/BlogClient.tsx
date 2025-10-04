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

  // Filter posts by selected tag
  const posts = selectedTag
    ? initialPosts.filter((post) => post.tags?.includes(selectedTag))
    : initialPosts;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-text-primary via-accent-blue to-accent-teal bg-clip-text text-transparent">
            Engineering & Thoughts
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl leading-relaxed">
            Exploring agile methodologies, agentic discovery, higher-order abstractions, and the ideas that shape how I build software.
          </p>
        </div>

        {/* Tag Filter */}
        <div className="mb-12">
          <TagFilter tags={allTags} selectedTag={selectedTag} onTagChange={setSelectedTag} />
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

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
