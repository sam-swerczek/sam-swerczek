/**
 * Helper utilities for simplified site configuration access
 */

import { getSiteConfig } from './queries';
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
  const configs = await getSiteConfig(category);
  const configObj = configArrayToObject<T>(configs);

  // Apply sanitization based on category
  if (category === 'music_social' || category === 'engineering_social') {
    Object.keys(configObj).forEach(key => {
      if (key.includes('url') || key.includes('handle')) {
        const value = configObj[key];
        if (value) {
          configObj[key] = sanitizeUrl(value) as any;
        }
      }
    });
  }

  if (category === 'general') {
    if (configObj['booking_email']) {
      configObj['booking_email'] = sanitizeEmail(configObj['booking_email']) as any;
    }
    // Image URLs and other URLs should also be validated
    ['profile_image_url', 'hero_image_url', 'contact_image_url'].forEach(key => {
      if (configObj[key]) {
        configObj[key] = sanitizeUrl(configObj[key]) as any;
      }
    });
  }

  if (category === 'streaming') {
    Object.keys(configObj).forEach(key => {
      if (key.includes('url')) {
        const value = configObj[key];
        if (value) {
          configObj[key] = sanitizeUrl(value) as any;
        }
      }
    });
  }

  if (category === 'featured_videos') {
    Object.keys(configObj).forEach(key => {
      if (key.includes('youtube_video_') && !key.includes('_title')) {
        const value = configObj[key];
        if (value) {
          // YouTube video IDs can be just the ID or a full URL
          // If it's a URL, validate it
          if (value.includes('http://') || value.includes('https://')) {
            configObj[key] = sanitizeUrl(value) as any;
          }
          // If it's just an ID, leave it as is
        }
      }
    });
  }

  return configObj;
}

/**
 * Fetch multiple config categories in parallel and return as separate objects
 */
export async function getMultipleConfigs<
  T extends Record<string, Record<string, string | undefined>>
>(categories: string[]): Promise<T> {
  const results = await Promise.all(
    categories.map(async (category) => {
      const configs = await getSiteConfig(category);
      return { category, data: configArrayToObject(configs) };
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
 * Helper to extract video objects from featured videos config
 */
export function extractVideosFromConfig(config: FeaturedVideosConfig) {
  return [
    { id: config.youtube_video_1, title: config.youtube_video_1_title },
    { id: config.youtube_video_2, title: config.youtube_video_2_title },
    { id: config.youtube_video_3, title: config.youtube_video_3_title },
    { id: config.youtube_video_4, title: config.youtube_video_4_title },
  ].filter((video) => Boolean(video.id));
}
