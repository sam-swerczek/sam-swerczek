'use client';

import { useEffect, useState, useRef, cloneElement } from 'react';
import { useYouTubePlayer } from '@/components/music/hooks/useYouTubePlayer';

interface LayoutClientProps {
  header: React.ReactNode;
  footer: React.ReactElement;
  children: React.ReactNode;
}

export default function LayoutClient({ header, footer, children }: LayoutClientProps) {
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lastScrollYRef = useRef(0);
  const isAtBottomRef = useRef(false);

  // Track when music is playing
  const { isPlaying } = useYouTubePlayer();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const lastScrollY = lastScrollYRef.current;

          // Check if at bottom with hysteresis
          // Use different thresholds for entering vs exiting "at bottom" state
          const distanceFromBottom = documentHeight - (windowHeight + currentScrollY);

          if (isAtBottomRef.current) {
            // If already at bottom, need to scroll up 150px before considering "not at bottom"
            if (distanceFromBottom > 150) {
              setIsAtBottom(false);
              isAtBottomRef.current = false;
            }
          } else {
            // If not at bottom, need to get within 100px to be considered "at bottom"
            if (distanceFromBottom <= 100) {
              setIsAtBottom(true);
              isAtBottomRef.current = true;
            }
          }

          // Determine scroll direction
          const scrollingDown = currentScrollY > lastScrollY;
          const scrollingUp = currentScrollY < lastScrollY;

          // Always show header and footer at top of page
          if (currentScrollY < 100) {
            setShowHeader(true);
            setShowFooter(true);
            setIsAtBottom(false);
            isAtBottomRef.current = false;
          }
          // Always show footer when at bottom (full view)
          else if (isAtBottomRef.current) {
            setShowFooter(true);
          }
          // Show/hide based on scroll direction for mid-page
          else if (scrollingDown && currentScrollY > 100) {
            setShowHeader(false);
            setShowFooter(false);
          } else if (scrollingUp && currentScrollY > 100) {
            // Only show on scroll up if not at the very top
            setShowHeader(true);
            setShowFooter(true);
          }

          // Override: Always show header and footer when music is playing
          if (isPlaying && currentScrollY > 100 && !isAtBottomRef.current) {
            setShowHeader(true);
            setShowFooter(true);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPlaying]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - slides up/down based on scroll */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {header}
      </div>

      {/* Spacer to prevent content from going under fixed header - approximately header + player bar height */}
      <div className="h-[140px]" />

      {/* Main content */}
      <main className="flex-grow pb-[200px]">
        {children}
      </main>

      {/* Footer - fixed at bottom, slides down/up based on scroll, compact when not at bottom */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
          showFooter ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {cloneElement(footer, { isCompact: !isAtBottom })}
      </div>
    </div>
  );
}
