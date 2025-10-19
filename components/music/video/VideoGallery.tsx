"use client";

import { useState } from "react";
import { useYouTubePlayer } from "@/components/music/hooks/useYouTubePlayer";
import type { VideoGalleryProps, Video } from "./types";

export default function VideoGallery({ videos }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { pause } = useYouTubePlayer();

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-background-secondary/50 backdrop-blur-sm rounded-2xl border border-text-secondary/10">
        <svg className="w-16 h-16 mx-auto mb-4 text-text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-text-secondary">No videos available</p>
      </div>
    );
  }

  const handleThumbnailClick = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
    // Pause the audio player when starting a video
    pause();
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    // Pause the audio player when starting a video
    pause();
  };

  return (
    <div className="w-full">
      {/* Primary Video Player */}
      <section aria-label="Featured video player" className="w-full lg:max-w-4xl md:max-w-3xl mx-auto mb-8 md:mb-12 animate-theater-reveal">
        {/* Outer glow container - creates theatrical spotlight effect */}
        <div className="relative px-4 py-6 md:px-8 md:py-10">
          {/* Multi-layer theatrical glow */}
          <div className="absolute inset-0 -z-10">
            {/* Inner blue glow */}
            <div className="absolute inset-0 bg-gradient-radial from-accent-blue/20 via-accent-blue/5 to-transparent blur-3xl" />
            {/* Teal accent glow */}
            <div className="absolute inset-0 bg-gradient-radial from-accent-teal/15 via-transparent to-transparent blur-2xl scale-110" />
          </div>

          {/* Premium frame wrapper */}
          <div className="relative">
            {/* Top accent line - like theater curtain rod */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />

            {/* Main player with enhanced frame */}
            <div className="relative group">
              {/* Animated border gradient */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-blue/30 via-accent-teal/20 to-accent-blue/30 p-[2px] animate-subtle-pulse">
                <div className="absolute inset-0 rounded-xl bg-background-primary" />
              </div>

              {/* Video player content */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-background-secondary shadow-[0_0_60px_rgba(74,158,255,0.15),0_0_120px_rgba(74,158,255,0.08)] group-hover:shadow-[0_0_80px_rgba(74,158,255,0.25),0_0_140px_rgba(74,158,255,0.12)] transition-all duration-500">
                {!isPlaying ? (
                  // Thumbnail with play button
                  <button
                    onClick={handlePlayClick}
                    className="relative w-full h-full group cursor-pointer"
                    aria-label={`Play ${selectedVideo?.title}`}
                  >
                    <img
                      src={selectedVideo?.thumbnailUrl || `https://img.youtube.com/vi/${selectedVideo?.id}/maxresdefault.jpg`}
                      alt={selectedVideo?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-200" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Multi-ring play button with pulse effect */}
                      <div className="relative">
                        {/* Outer pulse ring */}
                        <div className="absolute inset-0 bg-accent-blue/30 rounded-full animate-ping-slow scale-150" />

                        {/* Middle glow ring */}
                        <div className="absolute -inset-4 bg-accent-blue/20 rounded-full blur-xl" />

                        {/* Main button */}
                        <div className="relative bg-gradient-to-br from-accent-blue to-accent-teal rounded-full p-8 shadow-[0_0_40px_rgba(74,158,255,0.5)] group-hover:shadow-[0_0_60px_rgba(74,158,255,0.7)] group-hover:scale-110 transition-all duration-300">
                          {/* Inner white glow */}
                          <div className="absolute inset-2 bg-white/10 rounded-full blur-sm" />

                          {/* Play icon */}
                          <svg className="relative w-12 h-12 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {selectedVideo?.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <h3 className="text-white text-xl font-semibold">{selectedVideo.title}</h3>
                      </div>
                    )}
                  </button>
                ) : (
                  // YouTube iframe
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${selectedVideo?.id}?autoplay=1&rel=0`}
                    title={selectedVideo?.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>

            {/* Bottom accent line - creates premium frame */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent-teal/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Thumbnail Gallery */}
      <nav aria-label="Video playlist" className="mt-8 md:mt-10 lg:mt-12 max-w-4xl mx-auto relative">
        {/* Subtle divider line */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-text-secondary/30 to-transparent" />

        {/* Optional subtle label */}
        <div className="text-center mb-4 md:mb-6">
          <span className="text-text-secondary text-xs md:text-sm uppercase tracking-wider font-medium">
            More Videos
          </span>
        </div>

        {/* Mobile: Horizontal Cards */}
        <div className="md:hidden flex flex-col gap-2">
          {videos.map((video) => {
            const isActive = selectedVideo?.id === video.id;
            return (
              <button
                key={video.id}
                onClick={() => handleThumbnailClick(video)}
                className={`
                  flex items-center gap-3 rounded-lg overflow-hidden bg-background-secondary
                  transition-all duration-200 cursor-pointer group p-2
                  focus:ring-2 focus:ring-accent-blue focus:outline-none
                  ${isActive
                    ? 'border-2 border-accent-blue ring-2 ring-accent-blue/20'
                    : 'border border-accent-blue/20 hover:border-accent-blue/40'
                  }
                `}
                aria-current={isActive ? 'true' : undefined}
                aria-label={isActive ? `Now playing: ${video.title}` : `Play ${video.title}`}
                tabIndex={0}
              >
                {/* Small thumbnail on left */}
                <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                  <img
                    src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/40" />
                  )}
                </div>

                {/* Title on right */}
                <div className="flex-1 text-left pr-2">
                  <p className="text-white text-sm font-semibold line-clamp-2">
                    {video.title}
                  </p>
                  {isActive && (
                    <p className="text-accent-blue text-xs font-medium mt-0.5">Now Playing</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Tablet/Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {videos.map((video) => {
            const isActive = selectedVideo?.id === video.id;
            return (
              <button
                key={video.id}
                onClick={() => handleThumbnailClick(video)}
                className={`
                  relative aspect-video rounded-lg overflow-hidden bg-background-secondary
                  transition-all duration-200 cursor-pointer group
                  focus:ring-2 focus:ring-accent-blue focus:outline-none
                  ${isActive
                    ? 'border-2 border-accent-blue ring-2 ring-accent-blue/20'
                    : 'border border-accent-blue/10 hover:border-accent-blue/25'
                  }
                `}
                aria-current={isActive ? 'true' : undefined}
                aria-label={isActive ? `Now playing: ${video.title}` : `Play ${video.title}`}
                tabIndex={0}
              >
                {/* Thumbnail image */}
                <img
                  src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />

                {/* Overlay for inactive thumbnails */}
                {!isActive && (
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-opacity duration-200" />
                )}

                {/* Play icon for inactive thumbnails */}
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-accent-blue/90 rounded-full p-3">
                      <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Now Playing badge for active thumbnail */}
                {isActive && (
                  <div className="absolute top-2 right-2 bg-accent-blue text-white text-xs font-medium uppercase px-2 py-1 rounded-md">
                    Now Playing
                  </div>
                )}

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 md:p-3">
                  <p className="text-white text-sm md:text-base font-semibold line-clamp-2">
                    {video.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
