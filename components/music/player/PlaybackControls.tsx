"use client";

import PlayIcon from "@/components/ui/icons/PlayIcon";
import PauseIcon from "@/components/ui/icons/PauseIcon";

interface PlaybackControlsProps {
  isPlaying: boolean;
  isReady: boolean;
  canNavigate: boolean; // True if playlist has more than 1 song
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  variant?: "mini" | "full";
  className?: string;
  showTimeDisplay?: boolean;
  currentTime?: number;
  duration?: number;
}

export default function PlaybackControls({
  isPlaying,
  isReady,
  canNavigate,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  variant = "full",
  className = "",
  showTimeDisplay = false,
  currentTime = 0,
  duration = 0,
}: PlaybackControlsProps) {
  const togglePlay = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Mini variant: smaller, simpler buttons
  if (variant === "mini") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={!canNavigate}
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
          onClick={onNext}
          disabled={!canNavigate}
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent-blue/10 text-text-secondary hover:text-accent-blue transition-all duration-200 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next track"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
          </svg>
        </button>
      </div>
    );
  }

  // Full variant: larger buttons with time display
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={!isReady || !canNavigate}
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
        onClick={onNext}
        disabled={!isReady || !canNavigate}
        className="w-9 h-9 bg-background-secondary hover:bg-accent-blue/20 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next track"
      >
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
        </svg>
      </button>

      {/* Time Display (Optional) */}
      {showTimeDisplay && (
        <div className="hidden md:block text-xs text-text-secondary ml-1">
          <span className="font-mono">{formatTime(currentTime)}</span>
          <span className="mx-1.5">/</span>
          <span className="font-mono">{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
}
