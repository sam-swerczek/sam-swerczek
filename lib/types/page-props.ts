import { Post, Song } from '@/lib/types';
import { MusicSocialConfig, EngineeringSocialConfig } from '@/lib/supabase/config-helpers';

/**
 * Homepage data props
 * All data required to render the homepage sections
 */
export interface HomepageData {
  heroImageUrl?: string;
  aboutMeImageUrl?: string;
  musicImageUrl?: string;
  engineeringImageUrl?: string;
  contactImageUrl?: string;
  githubUrl: string;
  featuredSong: Song | null;
  blogPosts: Post[];
  social: MusicSocialConfig;
  commentCounts: Record<string, number>;
}

/**
 * Blog page data props
 * All data required to render the blog listing page
 */
export interface BlogPageData {
  posts: Post[];
  tags: string[];
  social: EngineeringSocialConfig;
}

/**
 * Music page data props
 * All data required to render the music page
 */
export interface MusicPageData {
  streamingConfig: Record<string, string>;
  socialConfig: MusicSocialConfig;
  videos: Array<{
    id: string;
    url: string;
    title: string;
    description?: string;
    thumbnail_url?: string;
  }>;
  generalConfig: Record<string, string>;
  songs: Song[];
}
