import { getPublishedPosts, getAllTags } from '@/lib/supabase/queries';
import { getConfigObject, EngineeringSocialConfig } from '@/lib/supabase/config-helpers';
import BlogClient from './BlogClient';

// Disable caching to always show fresh blog posts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  // Fetch all data in parallel for optimal performance
  const [allPosts, allTags, social] = await Promise.all([
    getPublishedPosts(),
    getAllTags(),
    getConfigObject<EngineeringSocialConfig>('engineering_social'),
  ]);

  return <BlogClient initialPosts={allPosts} allTags={allTags} social={social} />;
}
