'use client';

import { useState } from 'react';
import { Comment } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { TrashIcon, SpinnerIcon } from '@/components/ui/icons';

interface CommentCardProps {
  comment: Comment;
  onDelete: () => void;
}

export default function CommentCard({ comment, onDelete }: CommentCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if current user owns this comment
  const isOwner = user && user.id === comment.author_id;

  // Format date
  const formattedDate = new Date(comment.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Display name and initials from the snapshotted author metadata, with
  // graceful fallbacks for older comments that predate these fields.
  const displayName = comment.author_name?.trim() || 'Anonymous';
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase() || '?';

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete comment');
      }

      // Notify parent to refresh comments
      onDelete();
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-background-secondary/30 border border-text-secondary/10 rounded-lg p-6 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar - real photo from the auth provider when available */}
          {comment.author_avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={comment.author_avatar_url}
              alt=""
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-accent-blue/40"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-accent-blue/20 border border-accent-blue/40 flex items-center justify-center text-accent-blue font-semibold text-sm">
              {initials}
            </div>
          )}

          <div>
            <div className="text-text-primary font-medium">
              {displayName}
            </div>
            <time className="text-text-secondary/70 text-sm" dateTime={comment.created_at}>
              {formattedDate}
            </time>
          </div>
        </div>

        {/* Delete button - only shown to comment owner */}
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-text-secondary/70 hover:text-red-400 transition-colors p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Delete comment"
            type="button"
          >
            {isDeleting ? (
              <SpinnerIcon className="w-5 h-5 animate-spin" />
            ) : (
              <TrashIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Comment content */}
      <p className="text-text-secondary leading-relaxed whitespace-pre-wrap break-words">
        {comment.content}
      </p>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
