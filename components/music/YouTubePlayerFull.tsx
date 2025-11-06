"use client";

import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import { VolumeControl, PlaybackControls, ProgressBar, formatTime } from "./player";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { Song } from "@/lib/types";
import { SpotifyIcon, AppleMusicIcon, YoutubeIcon } from "@/components/ui/icons";

interface YouTubePlayerFullProps {
  songs: Song[];
  streamingLinks?: {
    spotifyUrl?: string;
    appleMusicUrl?: string;
    youtubePlaylistUrl?: string;
  };
}

export default function YouTubePlayerFull({ songs, streamingLinks }: YouTubePlayerFullProps) {
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

  // Prepare streaming platforms
  const platforms = [
    {
      name: "Spotify",
      url: streamingLinks?.spotifyUrl || "",
      icon: <SpotifyIcon className="w-5 h-5" />,
      iconColor: "text-[#1DB954]",
      hoverBg: "hover:bg-[#1DB954]/10",
    },
    {
      name: "Apple Music",
      url: streamingLinks?.appleMusicUrl || "",
      icon: <AppleMusicIcon className="w-5 h-5" />,
      iconColor: "text-[#FA243C]",
      hoverBg: "hover:bg-[#FA243C]/10",
    },
    {
      name: "YouTube Music",
      url: streamingLinks?.youtubePlaylistUrl || "",
      icon: <YoutubeIcon className="w-5 h-5" />,
      iconColor: "text-[#FF0000]",
      hoverBg: "hover:bg-[#FF0000]/10",
    },
  ].filter(platform => platform.url);

  return (
    <div className="w-full bg-gradient-to-br from-accent-blue/20 via-accent-teal/10 to-transparent border border-accent-blue/30 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-0">
        {/* Left Side: Album Art + Controls */}
        <div className="relative bg-gradient-to-br from-background-secondary to-black flex flex-col p-6">
          {/* Background blur effect */}
          {currentSong?.album_cover_url && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl scale-110"
              style={{ backgroundImage: `url(${currentSong.album_cover_url})` }}
            />
          )}

          <div className="relative z-10 flex flex-col h-full">
            {/* Album art */}
            <div className="mb-6">
              {currentSong?.album_cover_url ? (
                <div className="relative w-full aspect-square max-w-sm mx-auto">
                  <Image
                    src={currentSong.album_cover_url}
                    alt={currentSong.title}
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square max-w-sm mx-auto bg-accent-blue/20 rounded-lg flex items-center justify-center">
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

            {/* Song Info & Controls */}
            <div className="mt-auto">
              {/* Song Title */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-1 truncate text-white">
                  {currentSong?.title || 'Unknown Title'}
                </h3>
                <p className="text-text-secondary text-sm">{currentSong?.artist || 'Unknown Artist'}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <ProgressBar
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={seekTo}
                  variant="full"
                />
              </div>

              {/* Playback Controls & Volume */}
              <div className="flex items-center justify-between gap-4">
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

                <VolumeControl
                  volume={volume}
                  onVolumeChange={setVolume}
                  variant="full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Track List + Streaming Options */}
        <div className="bg-background-secondary/50 backdrop-blur-sm flex flex-col">
          {/* Track List */}
          {songs.length > 1 && (
            <div className="flex-1 p-6 overflow-y-auto">
              <h4 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">Playlist</h4>
              <div className="space-y-1">
                {songs.map((song, index) => {
                  const isCurrentSong = currentTrack?.id === song.id;
                  return (
                    <button
                      key={song.id}
                      onClick={() => handleTrackSelect(song, index)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
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
          )}

          {/* Streaming Links - Bottom of Right Side */}
          {platforms.length > 0 && (
            <div className="p-6 border-t border-accent-blue/10">
              <p className="text-xs text-text-secondary mb-3 uppercase tracking-wide text-center">Stream On</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {platforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-2 px-3 py-2 bg-background-secondary/50 border border-accent-blue/20 rounded-lg transition-all duration-200 ${platform.hoverBg} hover:border-accent-blue/40`}
                    title={platform.name}
                  >
                    <span className={`${platform.iconColor} transition-colors duration-200`}>
                      {platform.icon}
                    </span>
                    <span className="hidden sm:inline text-sm font-medium">
                      {platform.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
