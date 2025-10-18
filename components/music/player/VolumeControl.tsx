"use client";

import { useState } from "react";
import VolumeIcon from "@/components/ui/icons/VolumeIcon";

interface VolumeControlProps {
  volume: number; // 0-1
  onVolumeChange: (volume: number) => void; // 0-1
  variant?: "mini" | "full";
  className?: string;
}

export default function VolumeControl({
  volume,
  onVolumeChange,
  variant = "full",
  className = "",
}: VolumeControlProps) {
  const [showSlider, setShowSlider] = useState(false);

  const volumePercent = Math.round(volume * 100);

  const getVolumeLevel = (): "high" | "medium" | "low" | "muted" => {
    if (volume === 0) return "muted";
    if (volume < 0.33) return "low";
    if (volume < 0.66) return "medium";
    return "high";
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    onVolumeChange(newVolume);
  };

  // Mini variant: inline slider on desktop, popup on mobile
  if (variant === "mini") {
    return (
      <>
        {/* Desktop: Inline slider */}
        <div className={`hidden md:flex items-center gap-2 group ${className}`}>
          <VolumeIcon
            className="w-4 h-4 text-text-secondary group-hover:text-accent-blue transition-colors"
            level={getVolumeLevel()}
          />
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

        {/* Mobile: Icon with popup */}
        <button
          onClick={() => setShowSlider(!showSlider)}
          className={`md:hidden flex items-center justify-center w-7 h-7 rounded-full hover:bg-accent-blue/10 text-text-secondary hover:text-accent-blue transition-all duration-200 focus:outline-none ${className}`}
          aria-label={`Volume ${volumePercent}%`}
        >
          <VolumeIcon className="w-4 h-4" level={getVolumeLevel()} />
        </button>

        {showSlider && (
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
      </>
    );
  }

  // Full variant: hover popup with vertical slider
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowSlider(!showSlider)}
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
        className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-accent-blue transition-colors"
        aria-label="Volume control"
      >
        <VolumeIcon className="w-5 h-5" level={getVolumeLevel()} />
      </button>

      {showSlider && (
        <div
          className="absolute bottom-full right-0 mb-2 bg-background-secondary border border-text-secondary/20 rounded-lg p-2.5 shadow-lg"
          onMouseEnter={() => setShowSlider(true)}
          onMouseLeave={() => setShowSlider(false)}
        >
          <input
            type="range"
            min="0"
            max="100"
            value={volumePercent}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-accent-blue"
            style={{
              background: `linear-gradient(to right, #4a9eff 0%, #4a9eff ${volumePercent}%, rgb(31, 41, 55) ${volumePercent}%, rgb(31, 41, 55) 100%)`,
            }}
            aria-label="Volume slider"
          />
          <div className="text-center mt-1.5 text-xs text-text-secondary">
            {volumePercent}%
          </div>
        </div>
      )}
    </div>
  );
}
