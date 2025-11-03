import {
  getSiteConfig,
  getFeaturedSong,
  getPublishedPosts,
  getCommentCounts,
} from '@/lib/supabase/queries';
import {
  getConfigObject,
  type MusicSocialConfig
} from '@/lib/supabase/config-helpers';
import { HomepageData } from '@/lib/types/page-props';

/**
 * Fetches all data required for the homepage
 * Uses Promise.all for parallel queries to optimize performance
 *
 * @returns Homepage data including hero image, featured song, blog posts, and social config
 */
export async function getHomepageData(): Promise<HomepageData> {
  // Fetch all data in parallel for optimal performance
  const [siteConfig, featuredSong, blogPosts, social] = await Promise.all([
    getSiteConfig(),
    getFeaturedSong(),
    getPublishedPosts({ limit: 3 }),
    getConfigObject<MusicSocialConfig>('music_social'),
  ]);

  // Fetch comment counts for blog posts
  const postIds = blogPosts.map(post => post.id);
  const commentCounts = await getCommentCounts(postIds);

  // Extract specific config values
  const heroImageUrl = siteConfig.find(c => c.key === 'hero_image_url')?.value;
  const aboutMeImageUrl = siteConfig.find(c => c.key === 'about_me_image_url')?.value;
  const musicImageUrl = siteConfig.find(c => c.key === 'music_image_url')?.value;
  const engineeringImageUrl = siteConfig.find(c => c.key === 'engineering_image_url')?.value;
  const contactImageUrl = siteConfig.find(c => c.key === 'contact_image_url')?.value;
  const githubUrl = siteConfig.find(c => c.key === 'github_url')?.value || 'https://github.com';

  return {
    heroImageUrl,
    aboutMeImageUrl,
    musicImageUrl,
    engineeringImageUrl,
    contactImageUrl,
    githubUrl,
    featuredSong,
    blogPosts,
    social,
    commentCounts,
  };
}
