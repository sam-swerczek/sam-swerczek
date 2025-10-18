"use client";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void; // Optional for mini player
  variant?: "mini" | "full";
  showTimeLabels?: boolean;
  className?: string;
}

export default function ProgressBar({
  currentTime,
  duration,
  onSeek,
  variant = "full",
  showTimeLabels = true,
  className = "",
}: ProgressBarProps) {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * duration;
    onSeek(newTime);
  };

  // Mini variant: simple read-only progress bar
  if (variant === "mini") {
    return (
      <div className={`flex-1 min-w-0 h-1 bg-accent-blue/10 rounded-full overflow-hidden ${className}`}>
        <div
          className="h-full bg-accent-blue/60 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    );
  }

  // Full variant: interactive progress bar with time labels
  return (
    <div className={`mb-3 ${className}`}>
      <div
        className={`w-full h-2 bg-background-secondary rounded-full group ${
          onSeek ? "cursor-pointer" : ""
        }`}
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-accent-blue rounded-full transition-all group-hover:bg-accent-teal relative"
          style={{ width: `${progressPercent}%` }}
        >
          {onSeek && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-accent-blue rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>

      {showTimeLabels && (
        <div className="flex justify-between mt-1.5 text-xs text-text-secondary">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
}
