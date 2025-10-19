"use client";

import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import Image from "next/image";
import { formatTime } from "./player";
import type { Song } from "@/lib/types";

interface PlaylistExpansionProps {
  onClose: () => void;
}

export default function PlaylistExpansion({ onClose }: PlaylistExpansionProps) {
  const { playlist, currentTrack, isPlaying, loadTrack } = useYouTubePlayer();

  const handleTrackSelect = (track: typeof currentTrack, index: number) => {
    if (!track) return;

    // Convert CurrentTrack to Song format for loadTrack
    const song: Song = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      youtube_video_id: track.youtubeVideoId,
      album_cover_url: track.albumCoverUrl,
      content_type: 'audio',
      duration_seconds: track.durationSeconds ?? null,
      tags: track.tags ?? null,
      release_date: track.releaseDate ?? null,
      description: track.description ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      display_order: index,
      is_featured: false,
      is_active: true,
      spotify_url: null,
      apple_music_url: null,
    };

    loadTrack(song);
    onClose();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] max-h-[480px] bg-background-secondary/95 backdrop-blur-md border border-accent-blue/30 rounded-xl shadow-2xl z-50 animate-slide-down-fade overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-background-secondary/95 backdrop-blur-sm border-b border-accent-blue/20 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">
            Playlist {playlist.length > 0 && `(${playlist.length})`}
          </h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-accent-blue transition-colors p-1 rounded-md hover:bg-accent-blue/10"
            aria-label="Close playlist"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current Track Display */}
        {currentTrack && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-accent-blue/10">
            <div className="flex-shrink-0 w-12 h-12 relative rounded-lg overflow-hidden">
              {currentTrack.albumCoverUrl ? (
                <Image
                  src={currentTrack.albumCoverUrl}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="w-full h-full bg-accent-blue/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-blue/40" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-accent-blue truncate">
                Now Playing
              </div>
              <div className="text-sm font-semibold text-text-primary truncate">
                {currentTrack.title}
              </div>
              <div className="text-xs text-text-secondary truncate">
                {currentTrack.artist}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Track List */}
      <div className="overflow-y-auto max-h-[360px] p-2 custom-scrollbar">
        {playlist.length === 0 ? (
          <div className="text-center py-8 text-text-secondary text-sm">
            No tracks in playlist
          </div>
        ) : (
          <div className="space-y-1">
            {playlist.map((track, index) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(track, index)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all ${
                    isCurrentTrack
                      ? 'bg-accent-blue/20 border border-accent-blue/40'
                      : 'hover:bg-background-primary/50 border border-transparent hover:border-accent-blue/10'
                  }`}
                  aria-label={`Play ${track.title} by ${track.artist}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Track Number / Playing Indicator */}
                    <div className="flex-shrink-0 w-6 flex items-center justify-center">
                      {isCurrentTrack && isPlaying ? (
                        <div className="flex items-center justify-center gap-0.5">
                          <div className="w-0.5 h-3 bg-accent-blue animate-pulse" />
                          <div className="w-0.5 h-4 bg-accent-blue animate-pulse delay-75" style={{ animationDelay: '75ms' }} />
                          <div className="w-0.5 h-3 bg-accent-blue animate-pulse delay-150" style={{ animationDelay: '150ms' }} />
                        </div>
                      ) : (
                        <span className={`text-xs ${isCurrentTrack ? 'text-accent-blue font-semibold' : 'text-text-secondary'}`}>
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Album Art Thumbnail */}
                    <div className="flex-shrink-0 w-10 h-10 relative rounded-md overflow-hidden border border-accent-blue/20">
                      {track.albumCoverUrl ? (
                        <Image
                          src={track.albumCoverUrl}
                          alt={track.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full bg-accent-blue/10 flex items-center justify-center">
                          <svg className="w-5 h-5 text-accent-blue/40" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${isCurrentTrack ? 'text-accent-blue' : 'text-text-primary'}`}>
                        {track.title}
                      </div>
                      <div className="text-xs text-text-secondary truncate">
                        {track.artist}
                      </div>
                    </div>

                    {/* Duration */}
                    {track.durationSeconds && (
                      <div className="flex-shrink-0 text-xs text-text-secondary">
                        {formatTime(track.durationSeconds)}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
