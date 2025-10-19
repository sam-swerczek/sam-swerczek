/**
 * Helper utilities for simplified site configuration access
 */

import { createServerClient } from './server';
import type { SiteConfig } from '../types';
import { sanitizeUrl, sanitizeEmail } from '../utils/url-validation';

/**
 * Convert an array of SiteConfig objects to a typed object for easier access
 * @param configs - Array of site config objects
 * @returns Object with config keys as properties
 */
export function configArrayToObject<T extends Record<string, string | undefined>>(
  configs: SiteConfig[]
): T {
  return configs.reduce((acc, config) => {
    acc[config.key] = config.value;
    return acc;
  }, {} as any);
}

/**
 * Fetch site config by category and return as typed object with sanitized values
 * @param category - Config category to fetch
 * @returns Config object with keys as properties
 */
export async function getConfigObject<T extends Record<string, string | undefined>>(
  category?: string
): Promise<T> {
  // Use server client to bypass RLS policies for site config access
  const supabase = createServerClient();

  let query = supabase.from('site_config').select('*');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching site config:', error);
    return {} as T;
  }

  const configs = data as SiteConfig[];
  const configObj = configArrayToObject<T>(configs);

  // Work with a mutable copy for sanitization
  const mutableConfig: Record<string, string | undefined> = { ...configObj };

  // Apply sanitization based on category
  if (category === 'music_social' || category === 'engineering_social') {
    Object.keys(mutableConfig).forEach(key => {
      if (key.includes('url') || key.includes('handle')) {
        const value = mutableConfig[key];
        if (value) {
          mutableConfig[key] = sanitizeUrl(value);
        }
      }
    });
  }

  if (category === 'general') {
    if (mutableConfig['booking_email']) {
      mutableConfig['booking_email'] = sanitizeEmail(mutableConfig['booking_email']);
    }
    // Image URLs and other URLs should also be validated
    ['profile_image_url', 'hero_image_url', 'contact_image_url'].forEach(key => {
      if (mutableConfig[key]) {
        mutableConfig[key] = sanitizeUrl(mutableConfig[key]);
      }
    });
  }

  if (category === 'streaming') {
    Object.keys(mutableConfig).forEach(key => {
      if (key.includes('url')) {
        const value = mutableConfig[key];
        if (value) {
          mutableConfig[key] = sanitizeUrl(value);
        }
      }
    });
  }

  if (category === 'featured_videos') {
    Object.keys(mutableConfig).forEach(key => {
      if (key.includes('youtube_video_') && !key.includes('_title')) {
        const value = mutableConfig[key];
        if (value) {
          // YouTube video IDs can be just the ID or a full URL
          // If it's a URL, validate it
          if (value.includes('http://') || value.includes('https://')) {
            mutableConfig[key] = sanitizeUrl(value);
          }
          // If it's just an ID, leave it as is
        }
      }
    });
  }

  return mutableConfig as T;
}

/**
 * Fetch multiple config categories in parallel and return as separate objects
 */
export async function getMultipleConfigs<
  T extends Record<string, Record<string, string | undefined>>
>(categories: string[]): Promise<T> {
  const supabase = createServerClient();

  const results = await Promise.all(
    categories.map(async (category) => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('category', category);

      if (error) {
        console.error(`Error fetching site config for category ${category}:`, error);
        return { category, data: {} };
      }

      return { category, data: configArrayToObject(data as SiteConfig[]) };
    })
  );

  return results.reduce((acc, { category, data }) => {
    acc[category] = data;
    return acc;
  }, {} as any);
}

/**
 * Type definitions for common config categories
 */
export interface StreamingConfig extends Record<string, string | undefined> {
  spotify_url?: string;
  apple_music_url?: string;
  youtube_music_url?: string;
}

export interface MusicSocialConfig extends Record<string, string | undefined> {
  instagram_handle?: string;
  facebook_url?: string;
  linkedin_music?: string;
  tiktok_url?: string;
  patreon_url?: string;
}

export interface EngineeringSocialConfig extends Record<string, string | undefined> {
  github_url?: string;
  linkedin_url?: string;
}

export interface FeaturedVideosConfig extends Record<string, string | undefined> {
  youtube_video_1?: string;
  youtube_video_1_title?: string;
  youtube_video_2?: string;
  youtube_video_2_title?: string;
  youtube_video_3?: string;
  youtube_video_3_title?: string;
  youtube_video_4?: string;
  youtube_video_4_title?: string;
}

export interface GeneralConfig extends Record<string, string | undefined> {
  booking_email?: string;
  profile_image_url?: string;
  hero_image_url?: string;
  contact_image_url?: string;
}

/**
 * Video type for featured videos
 */
export interface Video {
  id: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
}

/**
 * Helper to extract video objects from featured videos config
 * Returns array of Video objects compatible with VideoGallery component
 */
export function extractVideosFromConfig(config: FeaturedVideosConfig): Video[] {
  const videos: Video[] = [];

  if (config.youtube_video_1) {
    videos.push({
      id: config.youtube_video_1,
      title: config.youtube_video_1_title || 'Untitled Video',
      description: null,
      thumbnailUrl: null,
    });
  }

  if (config.youtube_video_2) {
    videos.push({
      id: config.youtube_video_2,
      title: config.youtube_video_2_title || 'Untitled Video',
      description: null,
      thumbnailUrl: null,
    });
  }

  if (config.youtube_video_3) {
    videos.push({
      id: config.youtube_video_3,
      title: config.youtube_video_3_title || 'Untitled Video',
      description: null,
      thumbnailUrl: null,
    });
  }

  if (config.youtube_video_4) {
    videos.push({
      id: config.youtube_video_4,
      title: config.youtube_video_4_title || 'Untitled Video',
      description: null,
      thumbnailUrl: null,
    });
  }

  return videos;
}
