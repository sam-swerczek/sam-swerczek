"use client";

import { useState } from "react";
import Image from "next/image";
import type { VideoPlayerProps } from "./types";

export default function VideoPlayer({
  videoId,
  title,
  description,
  thumbnailUrl
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Use YouTube's default thumbnail if not provided
  const thumbnail = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="group">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-background-secondary border border-accent-blue/20 hover:border-accent-blue/40 transition-colors">
        {!isPlaying ? (
          <>
            {/* Thumbnail Image */}
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              unoptimized // YouTube thumbnails don't need Next.js optimization
            />

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Play Button Overlay */}
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform"
              aria-label={`Play ${title}`}
            >
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-2xl">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>

            {/* Video Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-lg drop-shadow-lg line-clamp-2">
                {title}
              </h3>
              {description && (
                <p className="text-white/90 text-sm mt-1 drop-shadow-md line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </>
        ) : (
          /* YouTube IFrame - only loaded when user clicks play */
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        )}
      </div>
    </div>
  );
}
