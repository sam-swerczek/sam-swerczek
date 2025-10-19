import { getPublishedPosts, getAllTags, getCommentCounts } from '@/lib/supabase/queries';
import { getConfigObject, EngineeringSocialConfig } from '@/lib/supabase/config-helpers';
import BlogClient from './BlogClient';

// Disable caching to always show fresh blog posts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  // Fetch posts first to get IDs for comment counts
  const allPosts = await getPublishedPosts();
  const postIds = allPosts.map((post) => post.id);

  // Fetch remaining data in parallel for optimal performance
  const [allTags, social, commentCounts] = await Promise.all([
    getAllTags(),
    getConfigObject<EngineeringSocialConfig>('engineering_social'),
    getCommentCounts(postIds),
  ]);

  return (
    <BlogClient
      initialPosts={allPosts}
      allTags={allTags}
      social={social}
      commentCounts={commentCounts}
    />
  );
}
