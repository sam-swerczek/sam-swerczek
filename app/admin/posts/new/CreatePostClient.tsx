'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import AIDraftAssistant from '@/components/admin/AIDraftAssistant';
import { createPost } from '@/lib/supabase/admin';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Post } from '@/lib/types';

interface AIDraftData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  metaDescription: string;
}

export default function CreatePostClient() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [aiDraft, setAiDraft] = useState<AIDraftData | null>(null);

  const handleSubmit = async (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Add the authenticated user's ID to the post data
      if (!user) {
        throw new Error('You must be logged in to create a post');
      }

      const postWithAuthor = {
        ...postData,
        author_id: user.id,
      };

      const newPost = await createPost(postWithAuthor);
      setSuccess(true);

      // Redirect to the edit page after a short delay
      setTimeout(() => {
        router.push(`/admin/posts/${newPost.id}`);
      }, 1000);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'Failed to create post');
      setIsLoading(false);
    }
  };

  const handleUseDraft = (draft: AIDraftData) => {
    setAiDraft(draft);
  };

  return (
    <div>
      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <div className="flex items-center gap-2 text-green-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-medium">Post created successfully! Redirecting...</p>
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
              <p className="font-medium">Error creating post</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Draft Assistant Button */}
      <div className="mb-6">
        <AIDraftAssistant onUseDraft={handleUseDraft} />
      </div>

      <PostForm onSubmit={handleSubmit} isLoading={isLoading} initialData={aiDraft || undefined} />
    </div>
  );
}
