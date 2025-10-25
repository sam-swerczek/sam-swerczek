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
  // General Settings
  { key: 'profile_image_url', value: '', category: 'general', label: 'Profile Image URL', placeholder: 'https://example.com/image.jpg' },
  { key: 'hero_image_url', value: '', category: 'general', label: 'Hero Image URL', placeholder: 'https://example.com/hero.jpg' },
  { key: 'contact_image_url', value: '', category: 'general', label: 'Contact Page Image URL', placeholder: 'https://example.com/contact.jpg' },
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
    general: 'General Settings',
    streaming: 'Streaming Music Platforms',
    music_social: 'Social Media',
    professional: 'Professional Links',
  };

  // Define category order
  const categoryOrder = ['general', 'streaming', 'music_social', 'professional'];

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
            {items.map((item) => (
                <div key={item.key}>
                  {(item.key === 'profile_image_url' || item.key === 'hero_image_url' || item.key === 'contact_image_url') ? (
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
                        {item.label}
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
