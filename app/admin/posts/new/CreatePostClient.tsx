'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';
import AIDraftAssistant from '@/components/admin/AIDraftAssistant';
import { createPost } from '@/lib/supabase/admin';
import { useAuth } from '@/lib/hooks/useAuth';
import { Alert } from '@/components/ui/Alert';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
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
  const [aiDraft, setAiDraft] = useState<AIDraftData | null>(null);

  const { handleSubmit, isLoading, error, success } = useFormSubmit({
    successDuration: 1000,
    onSuccess: () => {
      // Redirect handled in the submit function after post is created
    }
  });

  const onSubmit = async (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
    await handleSubmit(async () => {
      // Add the authenticated user's ID to the post data
      if (!user) {
        throw new Error('You must be logged in to create a post');
      }

      const postWithAuthor = {
        ...postData,
        author_id: user.id,
      };

      const newPost = await createPost(postWithAuthor);

      // Redirect to the edit page after a short delay
      setTimeout(() => {
        router.push(`/admin/posts/${newPost.id}`);
      }, 1000);
    });
  };

  const handleUseDraft = (draft: AIDraftData) => {
    setAiDraft(draft);
  };

  return (
    <div>
      {/* Success Message */}
      {success && (
        <div className="mb-6">
          <Alert type="success" message="Post created successfully! Redirecting..." />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <Alert type="error" title="Error creating post" message={error} />
        </div>
      )}

      {/* AI Draft Assistant Button */}
      <div className="mb-6">
        <AIDraftAssistant onUseDraft={handleUseDraft} />
      </div>

      <PostForm onSubmit={onSubmit} isLoading={isLoading} initialData={aiDraft || undefined} />
    </div>
  );
}
