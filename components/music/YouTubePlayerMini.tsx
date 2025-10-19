"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useYouTubePlayer } from "@/components/music/hooks/useYouTubePlayer";
import { usePlaylistExpansion } from "@/components/music/hooks/usePlaylistExpansion";
import { VolumeControl, PlaybackControls, ProgressBar } from "./player";
import PlaylistExpansion from "./PlaylistExpansion";
import ChevronDownIcon from "@/components/ui/icons/ChevronDownIcon";

export default function YouTubePlayerMini() {
  const pathname = usePathname();
  const [shouldFlash, setShouldFlash] = useState(false);

  const {
    isPlaying,
    volume,
    currentTime,
    duration,
    currentTrack,
    play,
    pause,
    setVolume,
    next,
    previous,
    playlist,
  } = useYouTubePlayer();

  const { isExpanded, toggle, close, expansionRef } = usePlaylistExpansion();

  // Flash animation when navigating to music page
  useEffect(() => {
    if (pathname === '/music') {
      setShouldFlash(true);
      const timer = setTimeout(() => setShouldFlash(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div
      className={`flex items-center gap-3 w-full relative ${shouldFlash ? 'animate-subtle-flash' : ''}`}
      ref={expansionRef}
    >
      {/* Album Cover & Song Title - Aligned with header */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Fixed-width container matching header profile image - 40px */}
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
          {currentTrack?.albumCoverUrl && (
            <div className="relative w-7 h-7 rounded overflow-hidden border border-accent-blue/20 hover:border-accent-blue/40 transition-colors">
              <Image
                src={currentTrack.albumCoverUrl}
                alt={`${currentTrack.title} Album Cover`}
                fill
                className="object-cover"
                sizes="28px"
              />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-medium text-text-secondary truncate whitespace-nowrap">
            {currentTrack?.title || 'No Track Playing'}
          </h3>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        variant="mini"
      />

      {/* Controls */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <PlaybackControls
          isPlaying={isPlaying}
          isReady={true}
          canNavigate={playlist.length > 1}
          onPlay={play}
          onPause={pause}
          onNext={next}
          onPrevious={previous}
          variant="mini"
        />

        <VolumeControl
          volume={volume}
          onVolumeChange={setVolume}
          variant="mini"
        />

        {/* Chevron Icon - Toggle playlist expansion */}
        <button
          onClick={toggle}
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent-blue/10 text-text-secondary hover:text-accent-blue transition-all duration-200 focus:outline-none"
          aria-label={isExpanded ? "Close playlist" : "Open playlist"}
          aria-expanded={isExpanded}
        >
          <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Playlist Expansion Panel */}
      {isExpanded && <PlaylistExpansion onClose={close} />}
    </div>
  );
}
