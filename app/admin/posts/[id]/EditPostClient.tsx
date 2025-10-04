'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { updatePost, deletePost } from '@/lib/supabase/admin';
import { Alert } from '@/components/ui/Alert';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import type { Post } from '@/lib/types';

interface EditPostClientProps {
  post: Post;
}

export default function EditPostClient({ post }: EditPostClientProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { handleSubmit, isLoading, error, success } = useFormSubmit({
    successDuration: 3000,
    onSuccess: () => {
      router.refresh();
    }
  });

  const onSubmit = async (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
    await handleSubmit(async () => {
      await updatePost(post.id, postData);
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deletePost(post.id);
      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      console.error('Error deleting post:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete post');
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div>
      {/* Success Message */}
      {success && (
        <div className="mb-6 animate-in fade-in duration-200">
          <Alert type="success" message="Post updated successfully!" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <Alert type="error" title="Error updating post" message={error} />
        </div>
      )}

      {/* Delete Error Message */}
      {deleteError && (
        <div className="mb-6">
          <Alert type="error" title="Error deleting post" message={deleteError} />
        </div>
      )}

      <PostForm post={post} onSubmit={onSubmit} isLoading={isLoading} />

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
            disabled={isLoading || isDeleting}
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
