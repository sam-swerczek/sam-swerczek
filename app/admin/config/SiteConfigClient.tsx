'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SiteConfig } from '@/lib/types';
import { updateSiteConfig, createSiteConfig } from '@/lib/supabase/admin';
import ImageUpload from '@/components/admin/ImageUpload';

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
}

// Predefined configuration items organized by category
const CONFIG_SCHEMA: ConfigItem[] = [
  // Music Social
  { key: 'spotify_url', value: '', category: 'music_social', label: 'Spotify URL', placeholder: 'https://open.spotify.com/artist/...' },
  { key: 'youtube_music_url', value: '', category: 'music_social', label: 'YouTube Channel', placeholder: 'https://youtube.com/@...' },
  { key: 'instagram_music', value: '', category: 'music_social', label: 'Instagram (Music)', placeholder: 'https://instagram.com/...' },
  { key: 'facebook_music', value: '', category: 'music_social', label: 'Facebook (Music)', placeholder: 'https://facebook.com/...' },
  { key: 'tiktok_music', value: '', category: 'music_social', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
  { key: 'patreon_url', value: '', category: 'music_social', label: 'Patreon', placeholder: 'https://patreon.com/...' },
  { key: 'youtube_video_1', value: '', category: 'music_social', label: 'Featured Video 1 ID', placeholder: 'dQw4w9WgXcQ' },
  { key: 'youtube_video_2', value: '', category: 'music_social', label: 'Featured Video 2 ID', placeholder: 'dQw4w9WgXcQ' },
  { key: 'youtube_video_3', value: '', category: 'music_social', label: 'Featured Video 3 ID', placeholder: 'dQw4w9WgXcQ' },
  { key: 'youtube_video_4', value: '', category: 'music_social', label: 'Featured Video 4 ID', placeholder: 'dQw4w9WgXcQ' },

  // Engineering Social
  { key: 'linkedin_url', value: '', category: 'engineering_social', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
  { key: 'github_url', value: '', category: 'engineering_social', label: 'GitHub', placeholder: 'https://github.com/...' },
  { key: 'twitter_url', value: '', category: 'engineering_social', label: 'Twitter/X', placeholder: 'https://twitter.com/...' },

  // General
  { key: 'contact_email', value: '', category: 'general', label: 'Contact Email', placeholder: 'hello@example.com' },
  { key: 'booking_email', value: '', category: 'general', label: 'Booking Email', placeholder: 'booking@example.com' },
  { key: 'profile_image_url', value: '', category: 'general', label: 'Profile Image URL', placeholder: 'https://example.com/image.jpg' },
];

export default function SiteConfigClient({ initialConfig }: SiteConfigClientProps) {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig[]>(initialConfig);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    music_social: 'Music Social Media',
    engineering_social: 'Engineering Social Media',
    general: 'General Settings',
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-green-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-medium">Configuration saved successfully!</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <div className="flex items-start gap-2 text-red-400">
            <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium">Error saving configuration</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Config Sections */}
      {Object.entries(configByCategory).map(([category, items]) => (
        <div
          key={category}
          className="bg-background-secondary rounded-lg border border-gray-800 p-6"
        >
          <h2 className="text-xl font-bold text-text-primary mb-4">
            {categoryLabels[category] || category}
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.key}>
                {item.key === 'profile_image_url' ? (
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
            ))}
          </div>
        </div>
      ))}

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
