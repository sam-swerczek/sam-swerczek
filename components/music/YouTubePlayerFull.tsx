"use client";

import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import PlayIcon from "@/components/ui/icons/PlayIcon";
import PauseIcon from "@/components/ui/icons/PauseIcon";
import VolumeIcon from "@/components/ui/icons/VolumeIcon";
import { useState, useEffect } from "react";
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

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
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

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleTrackSelect = (song: Song, index: number) => {
    console.log('🎵 Track selected:', {
      title: song.title,
      videoId: song.youtube_video_id,
      index,
      currentTrackId: currentTrack?.id,
      newSongId: song.id
    });
    loadTrack(song);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    next();
  };

  const handlePrevious = () => {
    previous();
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
              <img
                src={currentSong.album_cover_url}
                alt={currentSong.title}
                className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg shadow-2xl"
              />
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
          <div className="mb-3">
            <div
              className="w-full h-2 bg-background-secondary rounded-full cursor-pointer group"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-accent-blue rounded-full transition-all group-hover:bg-accent-teal relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-accent-blue rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-text-secondary">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Previous Button */}
              <button
                onClick={handlePrevious}
                disabled={!isReady || songs.length <= 1}
                className="w-9 h-9 bg-background-secondary hover:bg-accent-blue/20 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous track"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                disabled={!isReady}
                className="w-12 h-12 bg-accent-blue hover:bg-accent-teal rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <PauseIcon className="w-5 h-5 text-white" />
                ) : (
                  <PlayIcon className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={!isReady || songs.length <= 1}
                className="w-9 h-9 bg-background-secondary hover:bg-accent-blue/20 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next track"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>

              {/* Time Display */}
              <div className="hidden md:block text-xs text-text-secondary ml-1">
                <span className="font-mono">{formatTime(currentTime)}</span>
                <span className="mx-1.5">/</span>
                <span className="font-mono">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="relative">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-accent-blue transition-colors"
                aria-label="Volume control"
              >
                <VolumeIcon className="w-5 h-5" level={volume === 0 ? "muted" : volume < 0.33 ? "low" : volume < 0.66 ? "medium" : "high"} />
              </button>

              {/* Volume Slider */}
              {showVolumeSlider && (
                <div
                  className="absolute bottom-full right-0 mb-2 bg-background-secondary border border-text-secondary/20 rounded-lg p-2.5 shadow-lg"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-accent-blue"
                    style={{
                      background: `linear-gradient(to right, #4a9eff 0%, #4a9eff ${volume * 100}%, rgb(31, 41, 55) ${volume * 100}%, rgb(31, 41, 55) 100%)`
                    }}
                    aria-label="Volume slider"
                  />
                  <div className="text-center mt-1.5 text-xs text-text-secondary">
                    {Math.round(volume * 100)}%
                  </div>
                </div>
              )}
            </div>
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
