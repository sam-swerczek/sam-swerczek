'use client';

import { useState } from 'react';
import { SpinnerIcon } from '@/components/ui/icons';

interface CommentFormProps {
  postId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function CommentForm({ postId, onCancel, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError('Comment cannot be empty');
      return;
    }

    if (trimmedContent.length > 5000) {
      setError('Comment must be 5000 characters or less');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: trimmedContent,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post comment');
      }

      // Reset form and notify parent
      setContent('');
      onSuccess();
    } catch (err) {
      console.error('Error posting comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comment-content" className="sr-only">
          Your comment
        </label>
        <textarea
          id="comment-content"
          rows={4}
          className="w-full px-4 py-3 bg-background-secondary/20 border border-text-secondary/20 rounded-lg text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 transition-colors resize-none"
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          maxLength={5000}
          required
        />
        <div className="mt-1 text-sm text-text-secondary/60 text-right">
          {content.length} / 5000
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-text-secondary hover:text-text-primary border border-text-secondary/30 hover:border-text-secondary/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="group relative font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center overflow-hidden transform hover:scale-105 bg-gradient-to-r from-accent-blue to-accent-teal text-white hover:shadow-[0_0_30px_rgba(74,158,255,0.5)] hover:from-accent-teal hover:to-accent-blue px-6 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
          <span className="relative z-10">
            {isSubmitting ? (
              <>
                <SpinnerIcon className="w-4 h-4 mr-2 animate-spin inline-block" />
                Posting...
              </>
            ) : (
              'Post Comment'
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
