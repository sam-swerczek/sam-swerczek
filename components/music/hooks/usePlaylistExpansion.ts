"use client";

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook to manage playlist expansion state in the mini-player
 * Handles open/close state, click-outside detection, and keyboard controls
 */
export function usePlaylistExpansion() {
  const [isExpanded, setIsExpanded] = useState(false);
  const expansionRef = useRef<HTMLDivElement>(null);

  // Close on click outside and ESC key
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (expansionRef.current && !expansionRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    // Use mousedown instead of click for better UX (closes before click completes)
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  const toggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const close = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return { isExpanded, toggle, close, expansionRef };
}
