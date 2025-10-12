// =============================================
// DATABASE TYPES
// =============================================
// These types match the Supabase database schema exactly.
// See: supabase/migrations/001_initial_schema.sql

/**
 * Blog post with rich content, tags, and publishing workflow
 */
export interface Post {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  published_at: string | null;
  author_id: string;
  tags: string[];
  featured_image_url: string | null;
  meta_description: string | null;
}

/**
 * Site-wide configuration settings (social links, feature flags, etc.)
 */
export interface SiteConfig {
  id: string;
  key: string;
  value: string;
  category: string;
  updated_at: string;
}

/**
 * Uploaded media files (images, documents, etc.)
 */
export interface Media {
  id: string;
  created_at: string;
  filename: string;
  storage_path: string;
  url: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  caption: string | null;
  uploaded_by: string | null;
}

/**
 * Music track with YouTube integration
 */
export interface Song {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  artist: string;
  youtube_video_id: string;
  content_type: 'audio' | 'video';
  album_cover_url: string | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  duration_seconds: number | null;
  release_date: string | null;
  description: string | null;
  tags: string[] | null;
  spotify_url: string | null;
  apple_music_url: string | null;
}

// =============================================
// FORM TYPES (for creating/updating records)
// =============================================

/**
 * Data required to create a new post
 */
export type CreatePostData = Omit<Post, 'id' | 'created_at' | 'updated_at'>;

/**
 * Data that can be updated on a post
 */
export type UpdatePostData = Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Data required to create new media
 */
export type CreateMediaData = Omit<Media, 'id' | 'created_at'>;

/**
 * Data required to create site config
 */
export type CreateSiteConfigData = Omit<SiteConfig, 'id' | 'updated_at'>;

/**
 * Data required to create a new song
 */
export type CreateSongData = Omit<Song, 'id' | 'created_at' | 'updated_at'>;

/**
 * Data that can be updated on a song
 */
export type UpdateSongData = Partial<Omit<Song, 'id' | 'created_at' | 'updated_at'>>;

// =============================================
// API RESPONSE TYPES
// =============================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// =============================================
// COMPONENT PROP TYPES
// =============================================

/**
 * Props for post card component
 */
export interface PostCardProps {
  post: Post;
  featured?: boolean;
}

/**
 * Props for social link component
 */
export interface SocialLinkProps {
  platform: string;
  url: string;
  icon?: string;
}

// =============================================
// UTILITY TYPES
// =============================================

/**
 * Available post tag categories
 */
export type PostTag = string;

/**
 * Site config categories
 */
export type SiteConfigCategory =
  | 'music_social'
  | 'engineering_social'
  | 'general'
  | 'blog'
  | 'features';

/**
 * Post status for filtering
 */
export type PostStatus = 'published' | 'draft' | 'all';
