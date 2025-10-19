"use client";

import { useEffect, useRef, useMemo } from "react";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import type { Song } from "@/lib/types";
import { logger } from "@/lib/utils/logger";

interface FeaturedSongInitializerProps {
  featuredSong: Song | null;
  songs: Song[];
}

/**
 * Client component that initializes the YouTube player with the featured song and full playlist
 * This ensures the mini-player displays the featured song metadata and enables playlist navigation on initial page load
 */
export default function FeaturedSongInitializer({ featuredSong, songs }: FeaturedSongInitializerProps) {
  const { setPlaylist, currentTrack, isReady, playlist } = useYouTubePlayer();
  const hasInitialized = useRef(false);

  // Reorder playlist so featured song is always first
  const orderedPlaylist = useMemo(() => {
    if (!songs || songs.length === 0) return [];

    // If there's a featured song, put it first, then the rest in display_order
    if (featuredSong) {
      const otherSongs = songs.filter(s => s.id !== featuredSong.id);
      return [featuredSong, ...otherSongs];
    }

    // Otherwise, just use the songs as-is
    return songs;
  }, [songs, featuredSong]);

  useEffect(() => {
    // Only set up playlist if:
    // 1. We have songs to add
    // 2. We haven't initialized yet (component mount)
    // 3. The playlist is empty (prevents re-initialization on navigation)
    if (orderedPlaylist.length > 0 && !hasInitialized.current && playlist.length === 0) {
      logger.log('[FeaturedSongInitializer] Setting up playlist:');
      logger.log('   First track:', orderedPlaylist[0]?.title, '(YouTube ID:', orderedPlaylist[0]?.youtube_video_id + ')');
      logger.log('   Total songs:', orderedPlaylist.length);
      logger.log('   Full order:', orderedPlaylist.map(s => s.title).join(', '));
      setPlaylist(orderedPlaylist);
      hasInitialized.current = true;
    } else if (playlist.length > 0) {
      logger.log('[FeaturedSongInitializer] Playlist already initialized, skipping');
      hasInitialized.current = true; // Mark as initialized to prevent future attempts
    }
  }, [orderedPlaylist, setPlaylist, playlist.length]);

  // This component doesn't render anything
  return null;
}
