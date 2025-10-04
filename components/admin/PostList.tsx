'use client';

import Link from 'next/link';
import { Post } from '@/lib/types';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

interface PostListProps {
  posts: Post[];
  onDelete: (id: string) => void;
  onTogglePublished: (id: string, currentStatus: boolean) => void;
}

export default function PostList({ posts, onDelete, onTogglePublished }: PostListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      onDelete(postToDelete);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary mb-4">No posts found</p>
        <Link
          href="/admin/posts/new"
          className="text-accent-blue hover:text-accent-teal transition-colors"
        >
          Create your first post
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Title</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Published Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Tags</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-gray-800 hover:bg-background-secondary/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-text-primary hover:text-accent-blue transition-colors font-medium"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.published
                        ? 'bg-green-900/30 text-green-400 border border-green-700'
                        : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3 px-4 text-text-secondary text-sm">
                  {formatDate(post.published_at)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {post.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 bg-background-primary text-accent-blue text-xs rounded border border-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags?.length > 3 && (
                      <span className="text-text-secondary text-xs">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onTogglePublished(post.id, post.published)}
                      className="px-3 py-1 text-xs rounded-lg border border-gray-700 hover:bg-background-primary transition-colors"
                      title={post.published ? 'Unpublish' : 'Publish'}
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="px-3 py-1 text-xs rounded-lg border border-gray-700 hover:bg-background-primary transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(post.id)}
                      className="px-3 py-1 text-xs rounded-lg border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setPostToDelete(null);
        }}
        isDangerous={true}
      />
    </>
  );
}
