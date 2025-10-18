"use client";

import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import { VolumeControl, PlaybackControls, ProgressBar, formatTime } from "./player";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { Song } from "@/lib/types";

interface YouTubePlayerFullProps {
  songs: Song[];
}

export default function YouTubePlayerFull({ songs }: YouTubePlayerFullProps) {
  const {
    isPlaying,
    isPaused,
    volume,
    currentTime,
    duration,
    isReady,
    currentTrack,
    play,
    pause,
    setVolume,
    seekTo,
    loadTrack,
    next,
    previous,
    setPlaylist,
  } = useYouTubePlayer();

  const [currentIndex, setCurrentIndex] = useState(0);

  // Set playlist when songs change
  useEffect(() => {
    if (songs && songs.length > 0) {
      setPlaylist(songs);
    }
  }, [songs, setPlaylist]);

  // Load first track on mount if no track is loaded
  useEffect(() => {
    if (songs && songs.length > 0 && !currentTrack && isReady) {
      loadTrack(songs[0]);
      setCurrentIndex(0);
    }
  }, [songs, currentTrack, isReady, loadTrack]);

  // Early return if no songs (after all hooks)
  if (!songs || songs.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-accent-blue/20 via-accent-teal/10 to-transparent border border-accent-blue/30 rounded-2xl p-8 text-center">
        <p className="text-text-secondary">No songs available</p>
      </div>
    );
  }

  // Get current song
  const currentSong = currentTrack
    ? songs.find(s => s.id === currentTrack.id) || songs[currentIndex]
    : songs[currentIndex];

  const handleTrackSelect = (song: Song, index: number) => {
    loadTrack(song);
    setCurrentIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Player - Audio-only (no video display) */}
      <div className="w-full bg-gradient-to-br from-accent-blue/20 via-accent-teal/10 to-transparent border border-accent-blue/30 rounded-2xl overflow-hidden">
        {/* Album Art / Track Display */}
        <div className="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-background-secondary to-black relative overflow-hidden">
          {/* Background blur effect */}
          {currentSong?.album_cover_url && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl scale-110"
              style={{ backgroundImage: `url(${currentSong.album_cover_url})` }}
            />
          )}

          {/* Album art centered */}
          <div className="relative z-10 text-center">
            {currentSong?.album_cover_url ? (
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <Image
                  src={currentSong.album_cover_url}
                  alt={currentSong.title}
                  fill
                  className="object-cover rounded-lg shadow-2xl"
                  sizes="(max-width: 768px) 192px, 256px"
                />
              </div>
            ) : (
              <div className="w-48 h-48 md:w-64 md:h-64 bg-accent-blue/20 rounded-lg flex items-center justify-center">
                <svg className="w-24 h-24 text-accent-blue/40" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
            )}

            {!isReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white">Loading player...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-background-secondary/50 backdrop-blur-sm p-4">
          {/* Song Title */}
          <div className="mb-3">
            <h3 className="text-xl font-bold mb-0.5 truncate">
              {currentSong?.title || 'Unknown Title'}
            </h3>
            <p className="text-text-secondary text-sm">{currentSong?.artist || 'Unknown Artist'}</p>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
            variant="full"
          />

          {/* Playback Controls */}
          <div className="flex items-center justify-between">
            <PlaybackControls
              isPlaying={isPlaying}
              isReady={isReady}
              canNavigate={songs.length > 1}
              onPlay={play}
              onPause={pause}
              onNext={next}
              onPrevious={previous}
              variant="full"
              showTimeDisplay={true}
              currentTime={currentTime}
              duration={duration}
            />

            {/* Volume Control */}
            <VolumeControl
              volume={volume}
              onVolumeChange={setVolume}
              variant="full"
            />
          </div>
        </div>
      </div>

      {/* Track List */}
      {songs.length > 1 && (
        <div className="w-full bg-gradient-to-br from-accent-blue/10 via-accent-teal/5 to-transparent border border-accent-blue/20 rounded-2xl overflow-hidden">
          <div className="p-4">
            <h4 className="text-sm font-semibold text-text-secondary mb-3">Playlist</h4>
            <div className="space-y-1">
              {songs.map((song, index) => {
                const isCurrentSong = currentTrack?.id === song.id;
                return (
                  <button
                    key={song.id}
                    onClick={() => handleTrackSelect(song, index)}
                    className={`w-full text-left p-2.5 rounded-lg transition-all ${
                      isCurrentSong
                        ? 'bg-accent-blue/20 border border-accent-blue/40'
                        : 'hover:bg-background-secondary/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 text-center">
                        {isCurrentSong && isPlaying ? (
                          <div className="flex items-center justify-center gap-0.5">
                            <div className="w-0.5 h-3 bg-accent-blue animate-pulse" />
                            <div className="w-0.5 h-4 bg-accent-blue animate-pulse delay-75" />
                            <div className="w-0.5 h-3 bg-accent-blue animate-pulse delay-150" />
                          </div>
                        ) : (
                          <span className={`text-xs ${isCurrentSong ? 'text-accent-blue font-semibold' : 'text-text-secondary'}`}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${isCurrentSong ? 'text-accent-blue' : 'text-white'}`}>
                          {song.title}
                        </div>
                        <div className="text-xs text-text-secondary truncate">
                          {song.artist}
                        </div>
                      </div>
                      {song.duration_seconds && (
                        <div className="flex-shrink-0 text-xs text-text-secondary">
                          {formatTime(song.duration_seconds)}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
