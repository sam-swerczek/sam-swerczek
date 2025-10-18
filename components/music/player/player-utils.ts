/**
 * Shared utility functions for YouTube player components
 */

/**
 * Format time in seconds to MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Get volume level category for icon display
 * @param volume - Volume level (0-1)
 * @returns Volume level category
 */
export function getVolumeLevel(
  volume: number
): "high" | "medium" | "low" | "muted" {
  if (volume === 0) return "muted";
  if (volume < 0.33) return "low";
  if (volume < 0.66) return "medium";
  return "high";
}

/**
 * Calculate progress percentage
 * @param currentTime - Current time in seconds
 * @param duration - Total duration in seconds
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(currentTime: number, duration: number): number {
  return duration > 0 ? (currentTime / duration) * 100 : 0;
}

/**
 * Convert percentage to time
 * @param percent - Percentage (0-1)
 * @param duration - Total duration in seconds
 * @returns Time in seconds
 */
export function percentToTime(percent: number, duration: number): number {
  return percent * duration;
}
