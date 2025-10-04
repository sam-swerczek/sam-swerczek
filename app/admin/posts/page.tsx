import Link from 'next/link';
import { getAllPosts, deletePost as deletePostAction, togglePostPublished as togglePostPublishedAction } from '@/lib/supabase/admin';
import ManagePostsClient from './ManagePostsClient';
import type { Post } from '@/lib/types';

// Disable caching for this page to always show fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ManagePosts() {
  let posts: Post[] = [];

  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error('Error loading posts:', error);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Manage Posts</h1>
          <p className="text-text-secondary">View, edit, and manage all blog posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-6 py-3 bg-accent-blue hover:bg-accent-teal text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Create New Post
        </Link>
      </div>

      <ManagePostsClient initialPosts={posts} />
    </div>
  );
}
