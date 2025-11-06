"use client";

import { useState, useEffect, useRef } from "react";
import { useYouTubePlayer } from "@/components/music/hooks/useYouTubePlayer";
import type { VideoGalleryProps, Video } from "./types";

export default function VideoGallery({ videos }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { pause } = useYouTubePlayer();

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.2 } // Trigger when 20% visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
      {/* Unified Video Section */}
      <section
        ref={sectionRef}
        aria-label="Video gallery"
        className={`w-full max-w-6xl mx-auto opacity-0 ${isVisible ? 'animate-discover' : ''}`}
      >
        <div className="relative">
          {/* Section container with clean blue border */}
          <div className="relative rounded-2xl border border-accent-blue/30 overflow-hidden shadow-xl">
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-background-secondary/90 to-background-primary/90" />

            {/* Subtle pattern overlay */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(74, 158, 255, 0.3) 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />

            {/* Content */}
            <div className="relative p-6 md:p-10">
              {/* Primary Video Player */}
              <div className="mb-6 md:mb-8">
          <div className="group cursor-pointer" onClick={!isPlaying ? handlePlayClick : undefined}>
            {/* Video player with hover effect */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-background-secondary border-2 border-accent-blue/40 group-hover:border-accent-blue/60 shadow-lg group-hover:shadow-xl transition-all duration-300">
              {!isPlaying ? (
                // Thumbnail with play button
                <div className="relative w-full h-full">
                  <img
                    src={selectedVideo?.thumbnailUrl || `https://img.youtube.com/vi/${selectedVideo?.id}/maxresdefault.jpg`}
                    alt={selectedVideo?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />

                  {/* Play button with inviting pulse */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Subtle pulse ring on hover */}
                      <div className="absolute inset-0 bg-accent-blue/40 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Play button */}
                      <div className="relative bg-white hover:bg-accent-blue rounded-full p-5 md:p-7 shadow-2xl group-hover:shadow-accent-blue/50 group-hover:scale-110 transition-all duration-300">
                        <svg className="w-8 h-8 md:w-12 md:h-12 text-background-primary group-hover:text-white ml-1 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Video info at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    {selectedVideo?.title && (
                      <h2 className="text-white text-xl md:text-2xl font-bold mb-1 md:mb-2 drop-shadow-lg">
                        {selectedVideo.title}
                      </h2>
                    )}
                    <div className="flex items-center gap-2 text-white/90">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span className="text-sm md:text-base font-medium drop-shadow">Watch now</span>
                    </div>
                  </div>
                </div>
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

            {/* Optional description below */}
            {selectedVideo?.description && !isPlaying && (
              <div className="mt-4 md:mt-6 px-2">
                <p className="text-sm md:text-base text-text-secondary line-clamp-2">
                  {selectedVideo.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        <nav aria-label="Video playlist" className="relative">
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
          </div>
        </div>
      </section>
    </div>
  );
}
