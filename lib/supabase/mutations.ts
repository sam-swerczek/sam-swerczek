'use server';

import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from './server';
import { supabase } from './client';
import type { Song, CreateSongData, UpdateSongData, Comment, CreateCommentData } from '../types';

/**
 * SONG MUTATIONS
 * Server actions for creating, updating, and deleting songs
 */

/**
 * Get all songs (including inactive) for admin use
 */
export async function getAllSongs(): Promise<Song[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all songs:', error);
    throw new Error('Failed to fetch songs');
  }

  return data as Song[];
}

/**
 * Create a new song
 * @param songData - Song data to create
 * @returns The created song
 */
export async function createSong(songData: CreateSongData): Promise<Song> {
  const supabase = createServerClient();

  // If display_order not provided, get the max display_order and add 1
  if (songData.display_order === undefined || songData.display_order === null) {
    const { data: songs } = await supabase
      .from('songs')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);

    const maxOrder = songs && songs.length > 0 ? songs[0].display_order : 0;
    songData.display_order = maxOrder + 1;
  }

  // If setting as featured, unfeature all other songs first
  if (songData.is_featured) {
    await unfeaturedAllSongs();
  }

  const { data, error } = await supabase
    .from('songs')
    .insert([songData])
    .select()
    .single();

  if (error) {
    console.error('Error creating song:', error);
    throw new Error(`Failed to create song: ${error.message}`);
  }

  revalidatePath('/admin/songs');
  revalidatePath('/music');

  return data as Song;
}

/**
 * Update an existing song
 * @param id - Song ID
 * @param songData - Data to update
 * @returns The updated song
 */
export async function updateSong(id: string, songData: UpdateSongData): Promise<Song> {
  const supabase = createServerClient();

  // If setting as featured, unfeature all other songs first
  if (songData.is_featured) {
    await unfeaturedAllSongs();
  }

  const { data, error } = await supabase
    .from('songs')
    .update({
      ...songData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating song:', error);
    throw new Error(`Failed to update song: ${error.message}`);
  }

  revalidatePath('/admin/songs');
  revalidatePath('/music');

  return data as Song;
}

/**
 * Soft delete a song by setting is_active to false
 * @param id - Song ID
 * @returns Success status
 */
export async function deleteSong(id: string): Promise<boolean> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('songs')
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error deleting song:', error);
    throw new Error(`Failed to delete song: ${error.message}`);
  }

  revalidatePath('/admin/songs');
  revalidatePath('/music');

  return true;
}

/**
 * Hard delete a song (permanently remove from database)
 * @param id - Song ID
 * @returns Success status
 */
export async function permanentlyDeleteSong(id: string): Promise<boolean> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error permanently deleting song:', error);
    throw new Error(`Failed to permanently delete song: ${error.message}`);
  }

  revalidatePath('/admin/songs');
  revalidatePath('/music');

  return true;
}

/**
 * Reorder multiple songs at once
 * @param orders - Array of {id, display_order} objects
 * @returns Success status
 */
export async function reorderSongs(orders: { id: string; display_order: number }[]): Promise<boolean> {
  const supabase = createServerClient();

  // Update each song's display_order
  const updates = orders.map(({ id, display_order }) =>
    supabase
      .from('songs')
      .update({ display_order, updated_at: new Date().toISOString() })
      .eq('id', id)
  );

  const results = await Promise.all(updates);

  // Check if any updates failed
  const failed = results.find((result) => result.error);
  if (failed) {
    console.error('Error reordering songs:', failed.error);
    throw new Error('Failed to reorder songs');
  }

  revalidatePath('/admin/songs');
  revalidatePath('/music');

  return true;
}

/**
 * Set a song as featured (and unfeature all others)
 * @param id - Song ID to feature
 * @returns The updated song
 */
export async function setFeaturedSong(id: string): Promise<Song> {
  const supabase = createServerClient();

  // First, unfeature all songs
  await unfeaturedAllSongs();

  // Then feature the selected song
  const { data, error } = await supabase
    .from('songs')
    .update({
      is_featured: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error setting featured song:', error);
    throw new Error('Failed to set featured song');
  }

  revalidatePath('/admin/songs');
  revalidatePath('/music');

  return data as Song;
}

/**
 * Unfeature all songs (helper function)
 */
async function unfeaturedAllSongs(): Promise<void> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('songs')
    .update({
      is_featured: false,
      updated_at: new Date().toISOString(),
    })
    .eq('is_featured', true);

  if (error) {
    console.error('Error unfeaturing songs:', error);
    throw new Error('Failed to unfeature songs');
  }
}

/**
 * Toggle active status of a song
 * @param id - Song ID
 * @param currentStatus - Current is_active status
 * @returns The updated song
 */
export async function toggleSongActive(id: string, currentStatus: boolean): Promise<Song> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('songs')
    .update({
      is_active: !currentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling song active status:', error);
    throw new Error('Failed to toggle song status');
  }

  revalidatePath('/admin/songs');
  revalidatePath('/music');

  return data as Song;
}

// =============================================
// COMMENT MUTATIONS
// =============================================
// Note: These are NOT server actions - they're used from API routes
// which handle their own authentication and validation
// They accept a supabase client as parameter to use the authenticated route client

/**
 * Create a new comment (called from API route with authenticated client)
 * @param supabaseClient - Authenticated Supabase client from route
 * @param data - Comment data (post_id, author_id, content, is_visible)
 * @returns Created comment or null on error
 */
export async function createComment(supabaseClient: SupabaseClient, data: CreateCommentData): Promise<Comment | null> {
  const { data: comment, error } = await supabaseClient
    .from('comments')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return null;
  }

  return comment as Comment;
}

/**
 * Update a comment's content (called from API route with authenticated client)
 * @param supabaseClient - Authenticated Supabase client from route
 * @param id - Comment ID
 * @param content - New content
 * @returns Updated comment or null on error
 */
export async function updateComment(supabaseClient: SupabaseClient, id: string, content: string): Promise<Comment | null> {
  const { data: comment, error } = await supabaseClient
    .from('comments')
    .update({ content })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating comment:', error);
    return null;
  }

  return comment as Comment;
}

/**
 * Delete a comment (called from API route with authenticated client)
 * @param supabaseClient - Authenticated Supabase client from route
 * @param id - Comment ID
 * @returns True on success, false on error
 */
export async function deleteComment(supabaseClient: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabaseClient
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting comment:', error);
    return false;
  }

  return true;
}
