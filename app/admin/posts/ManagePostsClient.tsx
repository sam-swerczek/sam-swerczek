'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/types';
import PostList from '@/components/admin/PostList';
import { deletePost, togglePostPublished } from '@/lib/supabase/admin';
import { getButtonClasses } from '@/lib/utils/buttonStyles';

interface ManagePostsClientProps {
  initialPosts: Post[];
}

type FilterStatus = 'all' | 'published' | 'drafts';

export default function ManagePostsClient({ initialPosts }: ManagePostsClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by status
    if (filterStatus === 'published') {
      filtered = filtered.filter((post) => post.published);
    } else if (filterStatus === 'drafts') {
      filtered = filtered.filter((post) => !post.published);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [posts, filterStatus, searchTerm]);

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
      router.refresh();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const updatedPost = await togglePostPublished(id, currentStatus);
      setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
      router.refresh();
    } catch (error) {
      console.error('Error toggling post status:', error);
      alert('Failed to update post status. Please try again.');
    }
  };

  const stats = {
    all: posts.length,
    published: posts.filter((p) => p.published).length,
    drafts: posts.filter((p) => !p.published).length,
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-background-secondary rounded-lg border border-gray-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={getButtonClasses('filter', filterStatus === 'all')}
            >
              All ({stats.all})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={getButtonClasses('filter', filterStatus === 'published')}
            >
              Published ({stats.published})
            </button>
            <button
              onClick={() => setFilterStatus('drafts')}
              className={getButtonClasses('filter', filterStatus === 'drafts')}
            >
              Drafts ({stats.drafts})
            </button>
          </div>

          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts by title, excerpt, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-background-secondary rounded-lg border border-gray-800 overflow-hidden">
        <PostList
          posts={filteredPosts}
          onDelete={handleDelete}
          onTogglePublished={handleTogglePublished}
        />
      </div>
    </div>
  );
}
