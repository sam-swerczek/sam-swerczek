import { getPostById } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import EditPostClient from './EditPostClient';

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let post;
  try {
    post = await getPostById(id);
  } catch (error) {
    console.error('Error loading post:', error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Edit Post</h1>
        <p className="text-text-secondary">Update your blog post</p>
      </div>

      <div className="bg-background-secondary rounded-lg border border-gray-800 p-6">
        <EditPostClient post={post} />
      </div>
    </div>
  );
}
