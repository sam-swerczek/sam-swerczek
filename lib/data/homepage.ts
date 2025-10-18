import {
  getSiteConfig,
  getFeaturedSong,
  getPublishedPosts,
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

  // Extract specific config values
  const heroImageUrl = siteConfig.find(c => c.key === 'hero_image_url')?.value;
  const githubUrl = siteConfig.find(c => c.key === 'github_url')?.value || 'https://github.com';

  return {
    heroImageUrl,
    githubUrl,
    featuredSong,
    blogPosts,
    social,
  };
}
