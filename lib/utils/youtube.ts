/**
 * YouTube utility functions for extracting video IDs and fetching metadata
 */

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - Just the video ID itself
 *
 * @param input - YouTube URL or video ID
 * @returns Video ID or null if invalid
 */
export function extractYouTubeVideoId(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Trim whitespace
  input = input.trim();

  // If it's already just an ID (11 characters, alphanumeric with - and _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  // Pattern matching for various YouTube URL formats
  const patterns = [
    // https://www.youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // https://youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // https://www.youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // https://www.youtube.com/v/VIDEO_ID
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    // https://www.youtube.com/watch?v=VIDEO_ID&other_params
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Validate a YouTube video ID format
 * @param videoId - Video ID to validate
 * @returns True if valid format
 */
export function isValidYouTubeVideoId(videoId: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

/**
 * Generate YouTube thumbnail URL from video ID
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality (default, medium, high, maxres)
 * @returns Thumbnail URL
 */
export function getYouTubeThumbnailUrl(
  videoId: string,
  quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'
): string {
  const qualityMap = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg',
    high: 'hqdefault.jpg',
    maxres: 'maxresdefault.jpg',
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`;
}

/**
 * Generate YouTube embed URL from video ID
 * @param videoId - YouTube video ID
 * @param autoplay - Whether to autoplay the video
 * @returns Embed URL
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay: boolean = false): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    modestbranding: '1',
    rel: '0',
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Generate YouTube watch URL from video ID
 * @param videoId - YouTube video ID
 * @returns Watch URL
 */
export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Fetch video metadata using YouTube oEmbed API (no API key required)
 * @param videoId - YouTube video ID
 * @returns Video metadata or null if failed
 */
export async function fetchYouTubeMetadata(videoId: string): Promise<{
  title: string;
  author_name: string;
  thumbnail_url: string;
} | null> {
  try {
    const watchUrl = getYouTubeWatchUrl(videoId);
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`
    );

    if (!response.ok) {
      console.error('Failed to fetch YouTube metadata:', response.statusText);
      return null;
    }

    const data = await response.json();

    return {
      title: data.title || '',
      author_name: data.author_name || '',
      thumbnail_url: data.thumbnail_url || '',
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
}

/**
 * Validate that a YouTube video exists and is accessible
 * @param videoId - YouTube video ID
 * @returns True if video exists and is accessible
 */
export async function validateYouTubeVideo(videoId: string): Promise<boolean> {
  if (!isValidYouTubeVideoId(videoId)) {
    return false;
  }

  try {
    const metadata = await fetchYouTubeMetadata(videoId);
    return metadata !== null;
  } catch (error) {
    console.error('Error validating YouTube video:', error);
    return false;
  }
}

/**
 * Format duration from seconds to human-readable format (MM:SS or HH:MM:SS)
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined || seconds < 0) {
    return '--:--';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
