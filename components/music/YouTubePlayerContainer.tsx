'use client';

/**
 * YouTubePlayerContainer - Hidden container for YouTube iframe (audio-only)
 *
 * This component renders a hidden container that persists across all pages.
 * The YouTube IFrame API player is initialized once in this container
 * and never destroyed during normal navigation.
 *
 * AUDIO-ONLY APPROACH:
 * - The video player is always hidden off-screen
 * - Only audio plays (controlled via mini-player and full player controls)
 * - No video display needed - simpler and more reliable
 *
 * The player state is managed by YouTubePlayerContext.
 * UI components (mini player, full player) control the audio playback
 * of the underlying YouTube player instance.
 */
export default function YouTubePlayerContainer() {
  return (
    <div
      id="youtube-player-container"
      className="fixed w-0 h-0 opacity-0 pointer-events-none -left-[9999px]"
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: '-9999px',
        top: '0',
        width: '1px',
        height: '1px',
        pointerEvents: 'none',
        visibility: 'hidden'
      }}
    />
  );
}
