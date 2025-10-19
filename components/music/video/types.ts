/**
 * Video types for music page video gallery
 * Separate from audio player types to maintain clean separation
 *
 * Note: Video interface is defined in @/lib/supabase/config-helpers
 * to maintain consistency with config extraction
 */

import type { Video } from '@/lib/supabase/config-helpers';

export type { Video };

export interface VideoPlayerProps {
  videoId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface VideoGalleryProps {
  videos: Video[];
}
