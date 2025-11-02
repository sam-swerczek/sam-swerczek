"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useYouTubePlayer } from "@/components/music/hooks/useYouTubePlayer";
import { usePlaylistExpansion } from "@/components/music/hooks/usePlaylistExpansion";
import { VolumeControl, PlaybackControls, ProgressBar } from "./player";
import PlaylistExpansion from "./PlaylistExpansion";
import ChevronDownIcon from "@/components/ui/icons/ChevronDownIcon";

export default function YouTubePlayerMini() {

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
    autoplayBlocked,
  } = useYouTubePlayer();

  const { isExpanded, toggle, close, expansionRef } = usePlaylistExpansion();

  // Track when music just started to trigger one-time flash
  const [showHighlight, setShowHighlight] = useState(false);
  const previousPlayingRef = useRef(isPlaying);

  useEffect(() => {
    // Detect when music starts playing (transition from not playing to playing)
    if (!previousPlayingRef.current && isPlaying) {
      setShowHighlight(true);
      // Remove highlight after animation completes (2 seconds)
      setTimeout(() => {
        setShowHighlight(false);
      }, 2000);
    }
    previousPlayingRef.current = isPlaying;
  }, [isPlaying]);

  return (
    <>
      {/* Autoplay Blocked Message */}
      {autoplayBlocked && (
        <div className="absolute top-0 left-0 right-0 bg-accent-blue/10 border-b border-accent-blue/30 px-4 py-2 z-50 animate-slide-down-fade">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs md:text-sm text-text-primary">
                Music autoplay was blocked. Click <button onClick={play} className="underline font-medium text-accent-blue hover:text-accent-teal transition-colors">play</button> to start listening.
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="flex items-center gap-3 w-full relative"
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
          showHighlight={showHighlight}
        />

        <VolumeControl
          volume={volume}
          onVolumeChange={setVolume}
          variant="mini"
        />

        {/* Chevron Icon - Toggle playlist expansion */}
        <button
          onClick={toggle}
          className="relative flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent-blue/10 text-text-secondary hover:text-accent-blue transition-all duration-200 focus:outline-none"
          aria-label={isExpanded ? "Close playlist" : "Open playlist"}
          aria-expanded={isExpanded}
        >
          {/* Subtle pulse ring highlight - only show when music just started */}
          {showHighlight && (
            <span className="absolute inset-0 rounded-full bg-accent-blue/20 animate-ping-once opacity-75" aria-hidden="true" />
          )}
          <ChevronDownIcon className={`relative z-10 w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Playlist Expansion Panel */}
      {isExpanded && <PlaylistExpansion onClose={close} />}
      </div>
    </>
  );
}
