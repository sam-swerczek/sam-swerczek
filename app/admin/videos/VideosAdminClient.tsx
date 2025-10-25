'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SiteConfig } from '@/lib/types';
import { updateSiteConfig, createSiteConfig, getAllSiteConfig } from '@/lib/supabase/admin';
import { Alert } from '@/components/ui/Alert';
import { extractYouTubeVideoId, isValidYouTubeVideoId, fetchYouTubeMetadata, getYouTubeThumbnailUrl } from '@/lib/utils/youtube';
import { sanitizeText } from '@/lib/utils/sanitize';

// Constants
const MAX_VIDEOS = 4;
const MAX_TITLE_LENGTH = 200;

interface VideosAdminClientProps {
  initialConfig: SiteConfig[];
}

interface ConfigItem {
  id?: string;
  key: string;
  value: string;
  category: string;
  label: string;
  placeholder?: string;
  videoIndex?: number;
}

// Configuration schema for featured videos
const VIDEO_CONFIG_SCHEMA: ConfigItem[] = [
  { key: 'youtube_video_1', value: '', category: 'featured_videos', label: 'Video ID', placeholder: 'dQw4w9WgXcQ', videoIndex: 1 },
  { key: 'youtube_video_1_title', value: '', category: 'featured_videos', label: 'Video Title', placeholder: 'My Awesome Performance', videoIndex: 1 },
  { key: 'youtube_video_2', value: '', category: 'featured_videos', label: 'Video ID', placeholder: 'dQw4w9WgXcQ', videoIndex: 2 },
  { key: 'youtube_video_2_title', value: '', category: 'featured_videos', label: 'Video Title', placeholder: 'Live Session', videoIndex: 2 },
  { key: 'youtube_video_3', value: '', category: 'featured_videos', label: 'Video ID', placeholder: 'dQw4w9WgXcQ', videoIndex: 3 },
  { key: 'youtube_video_3_title', value: '', category: 'featured_videos', label: 'Video Title', placeholder: 'Cover Song', videoIndex: 3 },
  { key: 'youtube_video_4', value: '', category: 'featured_videos', label: 'Video ID', placeholder: 'dQw4w9WgXcQ', videoIndex: 4 },
  { key: 'youtube_video_4_title', value: '', category: 'featured_videos', label: 'Video Title', placeholder: 'Original Music', videoIndex: 4 },
];

export default function VideosAdminClient({ initialConfig }: VideosAdminClientProps) {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig[]>(initialConfig);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fetchingVideo, setFetchingVideo] = useState<number | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<number | null>(null);

  // Merge schema with existing config
  const configItems = useMemo(() => {
    return VIDEO_CONFIG_SCHEMA.map((schemaItem) => {
      const existingConfig = config.find((c) => c.key === schemaItem.key);
      return {
        ...schemaItem,
        id: existingConfig?.id,
        value: editedValues[schemaItem.key] ?? existingConfig?.value ?? schemaItem.value,
      };
    });
  }, [config, editedValues]);

  // Count configured videos
  const configuredVideosCount = useMemo(() => {
    let count = 0;
    for (let i = 1; i <= MAX_VIDEOS; i++) {
      const videoIdItem = configItems.find(item => item.key === `youtube_video_${i}`);
      if (videoIdItem && videoIdItem.value) {
        count++;
      }
    }
    return count;
  }, [configItems]);

  const handleValueChange = (key: string, value: string) => {
    // Sanitize text inputs
    const sanitizedValue = key.includes('_title') ? sanitizeText(value) : value;

    // Validate length
    if (key.includes('_title') && sanitizedValue.length > MAX_TITLE_LENGTH) {
      setError(`Video title must be ${MAX_TITLE_LENGTH} characters or less`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setEditedValues((prev) => ({ ...prev, [key]: sanitizedValue }));
  };

  // Handle YouTube URL paste
  const handleYouTubeUrlPaste = async (videoIndex: number, url: string) => {
    const videoId = extractYouTubeVideoId(url);

    if (!videoId || !isValidYouTubeVideoId(videoId)) {
      setError('Invalid YouTube URL or video ID');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Set the video ID immediately
    setEditedValues((prev) => ({ ...prev, [`youtube_video_${videoIndex}`]: videoId }));

    // Fetch the metadata
    setFetchingVideo(videoIndex);
    const metadata = await fetchYouTubeMetadata(videoId);
    setFetchingVideo(null);

    if (metadata && metadata.title) {
      // Sanitize and validate title length
      let sanitizedTitle = sanitizeText(metadata.title);
      if (sanitizedTitle.length > MAX_TITLE_LENGTH) {
        sanitizedTitle = sanitizedTitle.substring(0, MAX_TITLE_LENGTH - 3) + '...';
      }
      setEditedValues((prev) => ({ ...prev, [`youtube_video_${videoIndex}_title`]: sanitizedTitle }));
    }
  };

  // Handle video deletion with confirmation
  const handleDeleteVideo = (videoIndex: number) => {
    setDeletingVideo(videoIndex);
  };

  const confirmDeleteVideo = (videoIndex: number) => {
    handleValueChange(`youtube_video_${videoIndex}`, '');
    handleValueChange(`youtube_video_${videoIndex}_title`, '');
    setDeletingVideo(null);
  };

  const cancelDeleteVideo = () => {
    setDeletingVideo(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate all values before saving
      for (const [key, value] of Object.entries(editedValues)) {
        if (key.includes('_title') && value.length > MAX_TITLE_LENGTH) {
          setError(`Video titles must be ${MAX_TITLE_LENGTH} characters or less`);
          setIsLoading(false);
          return;
        }
        if (key.includes('youtube_video_') && !key.includes('_title')) {
          if (value && value.length > 0) {
            const videoId = extractYouTubeVideoId(value);
            if (!videoId || !isValidYouTubeVideoId(videoId)) {
              setError(`Invalid YouTube video ID for ${key}`);
              setIsLoading(false);
              return;
            }
          }
        }
      }

      const updates = Object.entries(editedValues).map(([key, value]) => {
        const item = configItems.find((c) => c.key === key);
        if (!item) return null;

        // Ensure video titles are sanitized before saving
        const sanitizedValue = key.includes('_title') ? sanitizeText(value) : value;

        if (item.id) {
          // Update existing config
          return updateSiteConfig(item.id, sanitizedValue);
        } else {
          // Create new config
          return createSiteConfig(key, sanitizedValue, item.category);
        }
      }).filter(Boolean);

      await Promise.all(updates);

      // Fetch updated config from database
      const updatedConfig = await getAllSiteConfig();
      const filteredConfig = updatedConfig.filter(c => c.category === 'featured_videos');
      setConfig(filteredConfig);

      // Revalidate paths to update frontend
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/music', '/admin/videos'] }),
      });

      setSuccess(true);
      setEditedValues({});
      router.refresh();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving videos:', err);
      setError(err instanceof Error ? err.message : 'Failed to save videos');
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = Object.keys(editedValues).length > 0;

  // Group video fields by index
  const videoGroups = useMemo(() => {
    const groups: Record<number, ConfigItem[]> = {};
    configItems.forEach(item => {
      if (item.videoIndex) {
        if (!groups[item.videoIndex]) {
          groups[item.videoIndex] = [];
        }
        groups[item.videoIndex].push(item);
      }
    });
    return groups;
  }, [configItems]);

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="animate-in fade-in duration-200">
          <Alert type="success" message="Videos saved successfully!" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Alert type="error" title="Error saving videos" message={error} />
      )}

      {/* Video Count Indicator */}
      <div className="bg-background-secondary rounded-lg border border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Featured Videos Status</h3>
            <p className="text-xs text-text-secondary mt-1">
              {configuredVideosCount} of {MAX_VIDEOS} video slots configured
            </p>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: MAX_VIDEOS }, (_, i) => i + 1).map(i => {
              const videoIdItem = configItems.find(item => item.key === `youtube_video_${i}`);
              const isConfigured = videoIdItem && videoIdItem.value;
              return (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isConfigured
                      ? 'bg-accent-teal text-white'
                      : 'bg-background-primary border border-gray-700 text-text-secondary'
                  }`}
                  title={`Video ${i}: ${isConfigured ? 'Configured' : 'Empty'}`}
                >
                  {i}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Management Cards */}
      <div className="space-y-4">
        {Object.entries(videoGroups).map(([index, groupItems]) => {
          const videoIdItem = groupItems.find(i => !i.key.includes('_title'));
          const titleItem = groupItems.find(i => i.key.includes('_title'));

          if (!videoIdItem || !titleItem) return null;

          const hasVideoId = !!videoIdItem.value;
          const videoIndex = parseInt(index);

          return (
            <div
              key={index}
              className="bg-background-secondary border border-gray-800 rounded-lg overflow-hidden"
            >
              <div className="flex items-center justify-between bg-background-primary/50 px-4 py-3 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-accent-blue">Featured Video {index}</h3>
                {hasVideoId && (
                  <button
                    onClick={() => handleDeleteVideo(videoIndex)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear Video
                  </button>
                )}
              </div>

              <div className="p-4 space-y-4">
                {/* Delete Confirmation Modal */}
                {deletingVideo === videoIndex && (
                  <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 space-y-3">
                    <p className="text-sm text-text-primary">
                      Are you sure you want to clear <strong>Video {index}</strong>?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmDeleteVideo(videoIndex)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Yes, Clear Video
                      </button>
                      <button
                        onClick={cancelDeleteVideo}
                        className="px-4 py-2 bg-background-primary border border-gray-600 text-text-primary rounded-lg text-sm font-medium hover:bg-background-secondary transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Preview Thumbnail */}
                {hasVideoId && !deletingVideo && (
                  <div className="relative">
                    <img
                      src={getYouTubeThumbnailUrl(videoIdItem.value, 'maxres')}
                      alt={titleItem.value || 'Video thumbnail'}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        // Fallback to medium quality thumbnail
                        (e.target as HTMLImageElement).src = getYouTubeThumbnailUrl(videoIdItem.value, 'medium');
                      }}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                      {videoIdItem.value}
                    </div>
                  </div>
                )}

                {/* YouTube URL Quick Input */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Quick Add: Paste YouTube URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                      onPaste={(e) => {
                        e.preventDefault();
                        const url = e.clipboardData.getData('text');
                        handleYouTubeUrlPaste(videoIndex, url);
                      }}
                      className="flex-1 px-3 py-2 bg-background-primary border border-gray-600 rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal placeholder:text-text-secondary/50"
                    />
                    {fetchingVideo === videoIndex && (
                      <span className="text-xs text-accent-teal self-center">Fetching title...</span>
                    )}
                  </div>
                </div>

                {/* Video ID */}
                <div>
                  <label
                    htmlFor={videoIdItem.key}
                    className="block text-xs font-medium text-text-primary mb-1"
                  >
                    {videoIdItem.label}
                  </label>
                  <input
                    type="text"
                    id={videoIdItem.key}
                    value={videoIdItem.value}
                    onChange={(e) => handleValueChange(videoIdItem.key, e.target.value)}
                    placeholder={videoIdItem.placeholder}
                    className="w-full px-3 py-2 bg-background-primary border border-gray-700 rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  />
                </div>

                {/* Video Title */}
                <div>
                  <label
                    htmlFor={titleItem.key}
                    className="block text-xs font-medium text-text-primary mb-1"
                  >
                    {titleItem.label}
                  </label>
                  <input
                    type="text"
                    id={titleItem.key}
                    value={titleItem.value}
                    onChange={(e) => handleValueChange(titleItem.key, e.target.value)}
                    placeholder={titleItem.placeholder}
                    className="w-full px-3 py-2 bg-background-primary border border-gray-700 rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <p className="text-sm text-text-secondary">
          {hasChanges ? 'You have unsaved changes' : 'No changes to save'}
        </p>
        <button
          onClick={handleSave}
          disabled={isLoading || !hasChanges}
          className="px-6 py-3 bg-accent-blue hover:bg-accent-teal text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
