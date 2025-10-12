"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useYouTubePlayer } from "@/components/music/hooks/useYouTubePlayer";
import PlayIcon from "@/components/ui/icons/PlayIcon";
import PauseIcon from "@/components/ui/icons/PauseIcon";
import VolumeIcon from "@/components/ui/icons/VolumeIcon";
import ExpandIcon from "@/components/ui/icons/ExpandIcon";

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
  } = useYouTubePlayer();

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume / 100); // Convert 0-100 to 0-1
  };

  const getVolumeLevel = (): "high" | "medium" | "low" | "muted" => {
    const volumePercent = volume * 100; // Convert 0-1 to 0-100
    if (volumePercent === 0) return "muted";
    if (volumePercent < 33) return "low";
    if (volumePercent < 66) return "medium";
    return "high";
  };

  const volumePercent = Math.round(volume * 100); // For display
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 w-full">
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
      <div className="flex-1 min-w-0 h-1 bg-accent-blue/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-blue/60 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Previous Button */}
        <button
          onClick={previous}
          disabled={playlist.length <= 1}
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent-blue/10 text-text-secondary hover:text-accent-blue transition-all duration-200 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous track"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent-blue/10 text-text-secondary hover:text-accent-blue transition-all duration-200 focus:outline-none"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <PauseIcon className="w-4 h-4" />
          ) : (
            <PlayIcon className="w-4 h-4" />
          )}
        </button>

        {/* Next Button */}
        <button
          onClick={next}
          disabled={playlist.length <= 1}
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent-blue/10 text-text-secondary hover:text-accent-blue transition-all duration-200 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next track"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
          </svg>
        </button>

        {/* Volume Control - Inline Slider */}
        <div className="hidden md:flex items-center gap-2 group">
          <VolumeIcon className="w-4 h-4 text-text-secondary group-hover:text-accent-blue transition-colors" level={getVolumeLevel()} />
          <input
            type="range"
            min="0"
            max="100"
            value={volumePercent}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-text-secondary/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-blue [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-accent-blue/80 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-blue [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
            style={{
              background: `linear-gradient(to right, #4a9eff 0%, #4a9eff ${volumePercent}%, rgba(160, 160, 160, 0.2) ${volumePercent}%, rgba(160, 160, 160, 0.2) 100%)`,
            }}
            aria-label="Volume slider"
          />
        </div>

        {/* Volume Control - Mobile (Icon Only) */}
        <button
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          className="md:hidden flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent-blue/10 text-text-secondary hover:text-accent-blue transition-all duration-200 focus:outline-none"
          aria-label={`Volume ${volumePercent}%`}
        >
          <VolumeIcon className="w-4 h-4" level={getVolumeLevel()} />
        </button>

        {/* Volume Slider - Mobile Popup */}
        {showVolumeSlider && (
          <div className="md:hidden absolute bottom-full right-4 mb-2 z-50">
            <div className="bg-background-secondary border border-text-secondary/20 rounded-lg p-3 shadow-lg">
              <input
                type="range"
                min="0"
                max="100"
                value={volumePercent}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-text-secondary/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-blue [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-blue [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                style={{
                  background: `linear-gradient(to right, #4a9eff 0%, #4a9eff ${volumePercent}%, rgba(160, 160, 160, 0.3) ${volumePercent}%, rgba(160, 160, 160, 0.3) 100%)`,
                }}
                aria-label="Volume slider"
              />
              <div className="text-xs text-center mt-1 text-text-secondary">
                {volumePercent}%
              </div>
            </div>
          </div>
        )}

        {/* Expand Icon - Navigate to /music */}
        <Link
          href="/music"
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent-blue/10 text-text-secondary hover:text-accent-blue transition-all duration-200 focus:outline-none"
          aria-label="Open full player"
        >
          <ExpandIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
