"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  autoload?: boolean;
}

export default function YouTubeEmbed({
  videoId,
  title = "YouTube video",
  autoload = false
}: YouTubeEmbedProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

  const modal = isModalOpen && mounted ? (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 md:p-12"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="relative w-full aspect-video max-w-[1600px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute -top-12 right-0 text-white hover:text-accent-blue transition-colors"
          aria-label="Close video"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden md:block">Press ESC or click outside to close</span>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </button>

        {/* Video iframe */}
        <iframe
          className="w-full h-full rounded-lg shadow-2xl"
          src={`${embedUrl}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-background-secondary group cursor-pointer">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
            aria-label="Play video"
          >
            <svg
              className="w-8 h-8 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white text-sm font-medium">{title}</p>
          </div>
        )}
      </div>

      {/* Render modal in portal to escape parent containers */}
      {mounted && modal && createPortal(modal, document.body)}
    </>
  );
}
