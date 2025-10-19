import { getPostById } from '@/lib/supabase/admin';
import { notFound, redirect } from 'next/navigation';
import EditPostClient from './EditPostClient';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  // Server-side authentication check
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle server component cookie limitations
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Now safe to fetch admin data
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
