'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SiteConfig } from '@/lib/types';
import { updateSiteConfig, createSiteConfig, getAllSiteConfig } from '@/lib/supabase/admin';
import ImageUpload from '@/components/admin/ImageUpload';
import { Alert } from '@/components/ui/Alert';

interface SiteConfigClientProps {
  initialConfig: SiteConfig[];
}

interface ConfigItem {
  id?: string;
  key: string;
  value: string;
  category: string;
  label: string;
  placeholder?: string;
  videoIndex?: number; // For grouping video ID and title together
}

// Predefined configuration items organized by category
const CONFIG_SCHEMA: ConfigItem[] = [
  // General Settings
  { key: 'profile_image_url', value: '', category: 'general', label: 'Profile Image URL', placeholder: 'https://example.com/image.jpg' },
  { key: 'hero_image_url', value: '', category: 'general', label: 'Hero Image URL', placeholder: 'https://example.com/hero.jpg' },
  { key: 'contact_email', value: '', category: 'general', label: 'Contact Email', placeholder: 'hello@example.com' },
  { key: 'booking_email', value: '', category: 'general', label: 'Booking Email', placeholder: 'booking@example.com' },

  // Streaming Music Platforms
  { key: 'spotify_url', value: '', category: 'streaming', label: 'Spotify', placeholder: 'https://open.spotify.com/artist/...' },
  { key: 'apple_music_url', value: '', category: 'streaming', label: 'Apple Music', placeholder: 'https://music.apple.com/...' },
  { key: 'youtube_music_url', value: '', category: 'streaming', label: 'YouTube Music/Channel', placeholder: 'https://youtube.com/@...' },

  // Social Media
  { key: 'instagram_handle', value: '', category: 'music_social', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'facebook_url', value: '', category: 'music_social', label: 'Facebook', placeholder: 'https://facebook.com/...' },
  { key: 'linkedin_music', value: '', category: 'music_social', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
  { key: 'tiktok_url', value: '', category: 'music_social', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
  { key: 'twitter_url', value: '', category: 'music_social', label: 'Twitter/X', placeholder: 'https://twitter.com/...' },
  { key: 'patreon_url', value: '', category: 'music_social', label: 'Patreon', placeholder: 'https://patreon.com/...' },

  // Professional Links
  { key: 'linkedin_url', value: '', category: 'professional', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
  { key: 'github_url', value: '', category: 'professional', label: 'GitHub', placeholder: 'https://github.com/...' },

  // Featured Videos
  { key: 'youtube_video_1', value: '', category: 'featured_videos', label: 'Video ID', placeholder: 'dQw4w9WgXcQ', videoIndex: 1 },
  { key: 'youtube_video_1_title', value: '', category: 'featured_videos', label: 'Video Title', placeholder: 'My Awesome Performance', videoIndex: 1 },
  { key: 'youtube_video_2', value: '', category: 'featured_videos', label: 'Video ID', placeholder: 'dQw4w9WgXcQ', videoIndex: 2 },
  { key: 'youtube_video_2_title', value: '', category: 'featured_videos', label: 'Video Title', placeholder: 'Live Session', videoIndex: 2 },
  { key: 'youtube_video_3', value: '', category: 'featured_videos', label: 'Video ID', placeholder: 'dQw4w9WgXcQ', videoIndex: 3 },
  { key: 'youtube_video_3_title', value: '', category: 'featured_videos', label: 'Video Title', placeholder: 'Cover Song', videoIndex: 3 },
  { key: 'youtube_video_4', value: '', category: 'featured_videos', label: 'Video ID', placeholder: 'dQw4w9WgXcQ', videoIndex: 4 },
  { key: 'youtube_video_4_title', value: '', category: 'featured_videos', label: 'Video Title', placeholder: 'Original Music', videoIndex: 4 },
];

export default function SiteConfigClient({ initialConfig }: SiteConfigClientProps) {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig[]>(initialConfig);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fetchingVideo, setFetchingVideo] = useState<number | null>(null);

  // Merge schema with existing config
  const configItems = useMemo(() => {
    return CONFIG_SCHEMA.map((schemaItem) => {
      const existingConfig = config.find((c) => c.key === schemaItem.key);
      return {
        ...schemaItem,
        id: existingConfig?.id,
        value: editedValues[schemaItem.key] ?? existingConfig?.value ?? schemaItem.value,
      };
    });
  }, [config, editedValues]);

  const handleValueChange = (key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | null => {
    // Match various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/ // Just the ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Fetch video title from YouTube
  const fetchYouTubeTitle = async (videoId: string): Promise<string | null> => {
    try {
      // Use YouTube oEmbed API (no API key required)
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (response.ok) {
        const data = await response.json();
        return data.title || null;
      }
    } catch (err) {
      console.error('Failed to fetch YouTube title:', err);
    }
    return null;
  };

  // Handle YouTube URL paste
  const handleYouTubeUrlPaste = async (videoIndex: number, url: string) => {
    const videoId = extractYouTubeId(url);

    if (!videoId) {
      setError('Invalid YouTube URL or video ID');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Set the video ID immediately
    handleValueChange(`youtube_video_${videoIndex}`, videoId);

    // Fetch the title
    setFetchingVideo(videoIndex);
    const title = await fetchYouTubeTitle(videoId);
    setFetchingVideo(null);

    if (title) {
      handleValueChange(`youtube_video_${videoIndex}_title`, title);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updates = Object.entries(editedValues).map(([key, value]) => {
        const item = configItems.find((c) => c.key === key);
        if (!item) return null;

        if (item.id) {
          // Update existing config
          return updateSiteConfig(item.id, value);
        } else {
          // Create new config
          return createSiteConfig(key, value, item.category);
        }
      }).filter(Boolean);

      await Promise.all(updates);

      // Fetch updated config from database
      const updatedConfig = await getAllSiteConfig();
      setConfig(updatedConfig);

      setSuccess(true);
      setEditedValues({});
      router.refresh();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving config:', err);
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = Object.keys(editedValues).length > 0;

  const configByCategory = useMemo(() => {
    const grouped: Record<string, ConfigItem[]> = {};
    configItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [configItems]);

  const categoryLabels: Record<string, string> = {
    general: 'General Settings',
    streaming: 'Streaming Music Platforms',
    music_social: 'Social Media',
    professional: 'Professional Links',
    featured_videos: 'Featured Videos',
  };

  // Define category order
  const categoryOrder = ['general', 'streaming', 'music_social', 'professional', 'featured_videos'];

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="animate-in fade-in duration-200">
          <Alert type="success" message="Configuration saved successfully!" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Alert type="error" title="Error saving configuration" message={error} />
      )}

      {/* Config Sections */}
      {categoryOrder.map((category) => {
        const items = configByCategory[category];
        if (!items || items.length === 0) return null;

        return (
        <div
          key={category}
          className="bg-background-secondary rounded-lg border border-gray-800 p-6"
        >
          <h2 className="text-xl font-bold text-text-primary mb-4">
            {categoryLabels[category] || category}
          </h2>

          <div className="space-y-4">
            {category === 'featured_videos' ? (
              // Group video fields by index
              (() => {
                const videoGroups: Record<number, ConfigItem[]> = {};
                items.forEach(item => {
                  if (item.videoIndex) {
                    if (!videoGroups[item.videoIndex]) {
                      videoGroups[item.videoIndex] = [];
                    }
                    videoGroups[item.videoIndex].push(item);
                  }
                });

                return Object.entries(videoGroups).map(([index, groupItems]) => {
                  const videoIdItem = groupItems.find(i => i.key.includes('_title') === false);
                  const titleItem = groupItems.find(i => i.key.includes('_title'));

                  if (!videoIdItem || !titleItem) return null;

                  return (
                    <div key={index} className="bg-background-primary/50 border border-gray-700 rounded-lg p-4 space-y-3">
                      <h3 className="text-sm font-semibold text-accent-blue">Featured Video {index}</h3>

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
                              handleYouTubeUrlPaste(parseInt(index), url);
                            }}
                            className="flex-1 px-3 py-2 bg-background-primary border border-gray-600 rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal placeholder:text-text-secondary/50"
                          />
                          {fetchingVideo === parseInt(index) && (
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
                          {videoIdItem.label} <span className="text-xs text-text-secondary font-mono">({videoIdItem.key})</span>
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
                          {titleItem.label} <span className="text-xs text-text-secondary font-mono">({titleItem.key})</span>
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
                  );
                });
              })()
            ) : (
              // Regular fields for other categories
              items.map((item) => (
                <div key={item.key}>
                  {(item.key === 'profile_image_url' || item.key === 'hero_image_url') ? (
                    <ImageUpload
                      currentImageUrl={item.value}
                      onImageUploaded={(url) => handleValueChange(item.key, url)}
                      label={item.label}
                    />
                  ) : (
                    <>
                      <label
                        htmlFor={item.key}
                        className="block text-sm font-medium text-text-primary mb-2"
                      >
                        {item.label} <span className="text-xs text-text-secondary font-mono">({item.key})</span>
                      </label>
                      <input
                        type="text"
                        id={item.key}
                        value={item.value}
                        onChange={(e) => handleValueChange(item.key, e.target.value)}
                        placeholder={item.placeholder}
                        className="w-full px-4 py-2 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      />
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      );
      })}

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
