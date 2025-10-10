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
  { key: 'youtube_video_1_title', value: '', category: 'music_social', label: 'Featured Video 1 Title', placeholder: 'My Awesome Performance' },
  { key: 'youtube_video_2', value: '', category: 'music_social', label: 'Featured Video 2 ID', placeholder: 'dQw4w9WgXcQ' },
  { key: 'youtube_video_2_title', value: '', category: 'music_social', label: 'Featured Video 2 Title', placeholder: 'Live Session' },
  { key: 'youtube_video_3', value: '', category: 'music_social', label: 'Featured Video 3 ID', placeholder: 'dQw4w9WgXcQ' },
  { key: 'youtube_video_3_title', value: '', category: 'music_social', label: 'Featured Video 3 Title', placeholder: 'Cover Song' },
  { key: 'youtube_video_4', value: '', category: 'music_social', label: 'Featured Video 4 ID', placeholder: 'dQw4w9WgXcQ' },
  { key: 'youtube_video_4_title', value: '', category: 'music_social', label: 'Featured Video 4 Title', placeholder: 'Original Music' },

  // Engineering Social
  { key: 'linkedin_url', value: '', category: 'engineering_social', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
  { key: 'github_url', value: '', category: 'engineering_social', label: 'GitHub', placeholder: 'https://github.com/...' },
  { key: 'twitter_url', value: '', category: 'engineering_social', label: 'Twitter/X', placeholder: 'https://twitter.com/...' },

  // General
  { key: 'contact_email', value: '', category: 'general', label: 'Contact Email', placeholder: 'hello@example.com' },
  { key: 'booking_email', value: '', category: 'general', label: 'Booking Email', placeholder: 'booking@example.com' },
  { key: 'profile_image_url', value: '', category: 'general', label: 'Profile Image URL', placeholder: 'https://example.com/image.jpg' },
  { key: 'hero_image_url', value: '', category: 'general', label: 'Hero Image URL', placeholder: 'https://example.com/hero.jpg' },
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
    music_social: 'Music Social Media',
    engineering_social: 'Engineering Social Media',
    general: 'General Settings',
  };

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
