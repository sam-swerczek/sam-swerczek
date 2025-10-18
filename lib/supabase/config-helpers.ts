/**
 * Helper utilities for simplified site configuration access
 */

import { getSiteConfig } from './queries';
import type { SiteConfig } from '../types';

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
 * Fetch site config by category and return as typed object
 * @param category - Config category to fetch
 * @returns Config object with keys as properties
 */
export async function getConfigObject<T extends Record<string, string | undefined>>(
  category?: string
): Promise<T> {
  const configs = await getSiteConfig(category);
  return configArrayToObject<T>(configs);
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
