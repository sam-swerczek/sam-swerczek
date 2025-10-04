'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { updatePost, deletePost } from '@/lib/supabase/admin';
import type { Post } from '@/lib/types';

interface EditPostClientProps {
  post: Post;
}

export default function EditPostClient({ post }: EditPostClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSubmit = async (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updatePost(post.id, postData);
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

      router.refresh();
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await deletePost(post.id);
      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      setIsLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div>
      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-green-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-medium">Post updated successfully!</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <div className="flex items-start gap-2 text-red-400">
            <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium">Error updating post</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <PostForm post={post} onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Delete Button */}
      <div className="mt-8 pt-8 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">Delete Post</h3>
            <p className="text-sm text-text-secondary">
              Permanently delete this post. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isLoading}
            className="px-6 py-2 bg-red-900/30 border border-red-700 text-red-400 rounded-lg font-semibold hover:bg-red-900/50 transition-colors disabled:opacity-50"
          >
            Delete Post
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Post"
        message={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        isDangerous={true}
      />
    </div>
  );
}
