import { supabase } from './client';
import { createServerClient } from './server';
import type { Post, SiteConfig } from '../types';

// PUBLIC QUERIES (using anon key)

/**
 * Get all published posts with optional filtering and pagination
 * @param options - Query options (limit, offset, tags)
 * @returns Published posts ordered by published_at descending
 */
export async function getPublishedPosts(options?: {
  limit?: number;
  offset?: number;
  tags?: string[];
}) {
  let query = supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  // Apply limit
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  // Apply offset for pagination
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  // Filter by tags if provided
  if (options?.tags && options.tags.length > 0) {
    query = query.overlaps('tags', options.tags);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }

  return data as Post[];
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }

  return data as Post;
}

export async function getPublishedPostsByTag(tag: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .contains('tags', [tag])
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }

  return data as Post[];
}

export async function getAllTags() {
  const { data, error } = await supabase
    .from('posts')
    .select('tags')
    .eq('published', true);

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  // Extract unique tags from all posts
  const tagsSet = new Set<string>();
  data.forEach((post: { tags: string[] }) => {
    post.tags?.forEach((tag: string) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

export async function getSiteConfig(category?: string) {
  let query = supabase.from('site_config').select('*');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching site config:', error);
    return [];
  }

  return data as SiteConfig[];
}

export async function getSiteConfigByKey(key: string) {
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    console.error('Error fetching site config by key:', error);
    return null;
  }

  return data as SiteConfig;
}

/**
 * Get featured posts (e.g., first 3 most recent)
 * @param limit - Number of featured posts to return (default: 3)
 * @returns Featured posts
 */
export async function getFeaturedPosts(limit: number = 3) {
  return getPublishedPosts({ limit });
}

/**
 * Get related posts based on shared tags
 * @param currentPostId - ID of the current post
 * @param tags - Tags of the current post
 * @param limit - Number of related posts to return (default: 3)
 * @returns Related posts
 */
export async function getRelatedPosts(
  currentPostId: string,
  tags: string[],
  limit: number = 3
) {
  if (!tags || tags.length === 0) {
    // If no tags, just return recent posts
    const posts = await getPublishedPosts({ limit });
    return posts.filter((post) => post.id !== currentPostId);
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .neq('id', currentPostId)
    .overlaps('tags', tags)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }

  return data as Post[];
}

/**
 * Count total published posts
 * @param tags - Optional tags to filter by
 * @returns Total count of published posts
 */
export async function getPublishedPostsCount(tags?: string[]): Promise<number> {
  let query = supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('published', true);

  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error counting posts:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Search posts by title, content, or excerpt
 * @param searchTerm - The search term
 * @param options - Query options (limit, offset, publishedOnly)
 * @returns Posts matching the search term
 */
export async function searchPosts(searchTerm: string, options?: {
  limit?: number;
  offset?: number;
  publishedOnly?: boolean;
}) {
  // Use publishedOnly flag (defaults to true for public API)
  const publishedOnly = options?.publishedOnly !== false;

  let query = supabase
    .from('posts')
    .select('*');

  // Only filter by published status if publishedOnly is true
  if (publishedOnly) {
    query = query.eq('published', true);
  }

  query = query
    .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
    .order(publishedOnly ? 'published_at' : 'created_at', { ascending: false })
    .limit(options?.limit || 10)
    .range(
      options?.offset || 0,
      (options?.offset || 0) + (options?.limit || 10) - 1
    );

  const { data, error } = await query;

  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }

  return data as Post[];
}

/**
 * Get music social links
 * @returns Music-related social links configuration
 */
export async function getMusicSocialLinks() {
  return getSiteConfig('music_social');
}

/**
 * Get engineering social links
 * @returns Engineering-related social links configuration
 */
export async function getEngineeringSocialLinks() {
  return getSiteConfig('engineering_social');
}

/**
 * Check if a slug is available
 * @param slug - The slug to check
 * @param excludePostId - Optional post ID to exclude from check (for updates)
 * @returns True if slug is available, false otherwise
 */
export async function isSlugAvailable(slug: string, excludePostId?: string): Promise<boolean> {
  let query = supabase
    .from('posts')
    .select('id')
    .eq('slug', slug);

  if (excludePostId) {
    query = query.neq('id', excludePostId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error checking slug availability:', error);
    return false;
  }

  return data.length === 0;
}
