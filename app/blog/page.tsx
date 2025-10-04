import { getPublishedPosts, getAllTags } from '@/lib/supabase/queries';
import BlogClient from './BlogClient';

// Disable caching to always show fresh blog posts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  const allPosts = await getPublishedPosts();
  const allTags = await getAllTags();

  return <BlogClient initialPosts={allPosts} allTags={allTags} />;
}
