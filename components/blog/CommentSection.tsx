'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import Button from '@/components/ui/Button';
import { MessageIcon, SpinnerIcon } from '@/components/ui/icons';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments
  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments?postId=${postId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      setComments(data.data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleCommentSuccess = () => {
    setShowForm(false);
    fetchComments(); // Refresh comments
  };

  const handleCommentDelete = () => {
    fetchComments(); // Refresh comments
  };

  return (
    <section className="mt-16 pt-12 border-t border-text-secondary/10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-text-primary flex items-center gap-3">
          <MessageIcon className="w-8 h-8 text-accent-blue" />
          Comments
          {!isLoading && (
            <span className="text-text-secondary/70 text-2xl font-normal">
              ({comments.length})
            </span>
          )}
        </h2>

        {/* Add Comment button - only shown to authenticated users */}
        {!authLoading && user && !showForm && (
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
          >
            Add Comment
          </Button>
        )}
      </div>

      {/* Comment form */}
      {showForm && user && (
        <div className="mb-8">
          <CommentForm
            postId={postId}
            onCancel={() => setShowForm(false)}
            onSuccess={handleCommentSuccess}
          />
        </div>
      )}

      {/* Login prompt for non-authenticated users */}
      {!authLoading && !user && (
        <div className="mb-8 p-6 bg-background-secondary/20 border border-text-secondary/20 rounded-lg text-center">
          <p className="text-text-secondary">
            Please{' '}
            <a href="/admin/login" className="text-accent-blue hover:text-accent-teal transition-colors underline">
              sign in
            </a>
            {' '}to leave a comment.
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <SpinnerIcon className="w-8 h-8 text-accent-blue animate-spin" />
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && comments.length === 0 && (
        <div className="text-center py-12">
          <MessageIcon className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
          <p className="text-text-secondary text-lg">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}

      {/* Comments list */}
      {!isLoading && !error && comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onDelete={handleCommentDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
