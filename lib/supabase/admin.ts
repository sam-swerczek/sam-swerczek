'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from './server';
import type { Post, SiteConfig } from '../types';

// ADMIN QUERIES (using service role key for full access)

export async function getAllPosts() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all posts:', error);
    throw new Error('Failed to fetch posts');
  }

  return data as Post[];
}

export async function getPostById(id: string) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching post by id:', error);
    throw new Error('Failed to fetch post');
  }

  return data as Post;
}

export async function getPostsByStatus(published: boolean) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', published)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by status:', error);
    throw new Error('Failed to fetch posts');
  }

  return data as Post[];
}

/**
 * Search posts by title, content, or excerpt (admin version)
 * NOTE: This function has been consolidated into queries.ts
 * For admin use cases, import searchPosts from queries.ts and use:
 * searchPosts(searchTerm, { publishedOnly: false })
 *
 * This provides a unified search function that can be used for both
 * public (published posts only) and admin (all posts) scenarios.
 */

export async function getPostStats() {
  const supabase = createServerClient();

  const { data: allPosts, error: allError } = await supabase
    .from('posts')
    .select('id, published');

  if (allError) {
    console.error('Error fetching post stats:', allError);
    throw new Error('Failed to fetch post stats');
  }

  const total = allPosts.length;
  const published = allPosts.filter((p: { published: boolean }) => p.published).length;
  const drafts = total - published;

  return { total, published, drafts };
}

// Create a new post
export async function createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createServerClient();

  // If author_id is not provided or is empty, we need to get it from the session
  // Since we're using service role key, we'll need the author_id to be passed in
  // For now, let's check if it exists and is valid
  if (!postData.author_id || postData.author_id === '') {
    throw new Error('User not authenticated - author_id is required');
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([postData])
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }

  // Revalidate the posts list page to show the new post
  revalidatePath('/admin/posts');

  return data as Post;
}

// Update an existing post
export async function updatePost(id: string, postData: Partial<Post>) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('posts')
    .update({
      ...postData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }

  // Revalidate the posts list page to show the updated post
  revalidatePath('/admin/posts');

  return data as Post;
}

// Delete a post
export async function deletePost(id: string) {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }

  // Revalidate the posts list page to reflect the deletion
  revalidatePath('/admin/posts');

  return true;
}

// Toggle post published status
export async function togglePostPublished(id: string, currentStatus: boolean) {
  const supabase = createServerClient();

  const updates: Partial<Post> = {
    published: !currentStatus,
    updated_at: new Date().toISOString(),
  };

  // If publishing, set published_at
  if (!currentStatus) {
    updates.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling post status:', error);
    throw new Error('Failed to toggle post status');
  }

  // Revalidate the posts list page to reflect the status change
  revalidatePath('/admin/posts');

  return data as Post;
}

// SITE CONFIG ADMIN QUERIES

export async function getAllSiteConfig() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching site config:', error);
    throw new Error('Failed to fetch site config');
  }

  return data as SiteConfig[];
}

export async function updateSiteConfig(id: string, value: string) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('site_config')
    .update({
      value,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating site config:', error);
    throw new Error('Failed to update site config');
  }

  return data as SiteConfig;
}

export async function createSiteConfig(key: string, value: string, category: string) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('site_config')
    .insert([{
      key,
      value,
      category,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating site config:', error);
    throw new Error('Failed to create site config');
  }

  return data as SiteConfig;
}

export async function deleteSiteConfig(id: string) {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('site_config')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting site config:', error);
    throw new Error('Failed to delete site config');
  }

  return true;
}

// MEDIA ADMIN QUERIES

export async function getAllMedia() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching media:', error);
    throw new Error('Failed to fetch media');
  }

  return data;
}

export async function createMedia(mediaData: {
  filename: string;
  storage_path: string;
  url: string;
  mime_type?: string;
  size_bytes?: number;
  alt_text?: string;
  caption?: string;
  uploaded_by: string;
}) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('media')
    .insert([mediaData])
    .select()
    .single();

  if (error) {
    console.error('Error creating media:', error);
    throw new Error('Failed to create media');
  }

  return data;
}

export async function deleteMedia(id: string) {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting media:', error);
    throw new Error('Failed to delete media');
  }

  return true;
}

// STORAGE ADMIN FUNCTIONS

/**
 * Upload a profile image to Supabase Storage
 * @param file - The file to upload (as FormData)
 * @param userId - The user ID for organizing files
 * @returns The public URL of the uploaded image
 */
export async function uploadProfileImage(formData: FormData) {
  const supabase = createServerClient();

  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload an image (JPEG, PNG, WebP, or GIF)');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 5MB');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `profile-${Date.now()}.${fileExt}`;
  const filePath = `profiles/${fileName}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return publicUrl;
}
