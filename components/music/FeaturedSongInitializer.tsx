"use client";

import { useEffect, useRef } from "react";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import type { Song } from "@/lib/types";

interface FeaturedSongInitializerProps {
  featuredSong: Song | null;
  songs: Song[];
}

/**
 * Client component that initializes the YouTube player with the featured song and full playlist
 * This ensures the mini-player displays the featured song metadata and enables playlist navigation on initial page load
 */
export default function FeaturedSongInitializer({ featuredSong, songs }: FeaturedSongInitializerProps) {
  const { loadTrack, setPlaylist, currentTrack, isReady } = useYouTubePlayer();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Set up playlist when songs are available
    if (songs && songs.length > 0) {
      console.log('Setting up playlist with', songs.length, 'songs');
      setPlaylist(songs);
    }
  }, [songs, setPlaylist]);

  useEffect(() => {
    // Only initialize once when the player is ready and we have a featured song
    if (featuredSong && isReady && !currentTrack && !hasInitialized.current) {
      console.log('Initializing player with featured song:', featuredSong.title);
      loadTrack(featuredSong);
      hasInitialized.current = true;
    }
  }, [featuredSong, isReady, currentTrack, loadTrack]);

  // This component doesn't render anything
  return null;
}
