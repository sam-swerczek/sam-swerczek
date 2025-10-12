"use client";

import { useContext } from 'react';
import { YouTubePlayerContext, YouTubePlayerContextValue } from '@/lib/contexts/YouTubePlayerContext';

/**
 * Custom hook to access YouTube player state and controls
 *
 * @throws {Error} If used outside of YouTubePlayerProvider
 * @returns {YouTubePlayerContextValue} Player state and control methods
 *
 * @example
 * ```tsx
 * function MusicPlayer() {
 *   const {
 *     videoId,
 *     isPlaying,
 *     volume,
 *     currentTime,
 *     duration,
 *     isReady,
 *     hasVisited,
 *     play,
 *     pause,
 *     setVolume,
 *     seekTo,
 *     loadVideo,
 *   } = useYouTubePlayer();
 *
 *   return (
 *     <div>
 *       <button onClick={isPlaying ? pause : play}>
 *         {isPlaying ? 'Pause' : 'Play'}
 *       </button>
 *       <input
 *         type="range"
 *         min="0"
 *         max="1"
 *         step="0.01"
 *         value={volume}
 *         onChange={(e) => setVolume(parseFloat(e.target.value))}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useYouTubePlayer(): YouTubePlayerContextValue {
  const context = useContext(YouTubePlayerContext);

  if (context === null) {
    throw new Error(
      'useYouTubePlayer must be used within a YouTubePlayerProvider. ' +
      'Make sure your component is wrapped with <YouTubePlayerProvider>.'
    );
  }

  return context;
}
