'use client';

import { useState, useEffect } from 'react';
import { Song } from '@/lib/types';
import { Alert } from '@/components/ui/Alert';
import {
  extractYouTubeVideoId,
  fetchYouTubeMetadata,
  getYouTubeThumbnailUrl,
  isValidYouTubeVideoId,
} from '@/lib/utils/youtube';
import { createSong, updateSong } from '@/lib/supabase/mutations';

interface SongFormProps {
  song: Song | null; // null for creating new song
  onSuccess: (song: Song) => void;
  onCancel: () => void;
}

export default function SongForm({ song, onSuccess, onCancel }: SongFormProps) {
  const isEditing = song !== null;

  // Form state
  const [formData, setFormData] = useState({
    title: song?.title || '',
    artist: song?.artist || '',
    youtube_video_id: song?.youtube_video_id || '',
    content_type: song?.content_type || 'audio',
    album_cover_url: song?.album_cover_url || '',
    display_order: song?.display_order ?? 0,
    is_featured: song?.is_featured ?? false,
    is_active: song?.is_active ?? true,
    duration_seconds: song?.duration_seconds ?? null,
    release_date: song?.release_date || '',
    description: song?.description || '',
    tags: song?.tags?.join(', ') || '',
    spotify_url: song?.spotify_url || '',
    apple_music_url: song?.apple_music_url || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [videoPreview, setVideoPreview] = useState<string | null>(
    song?.youtube_video_id || null
  );

  // Update video preview when video ID changes
  useEffect(() => {
    if (formData.youtube_video_id && isValidYouTubeVideoId(formData.youtube_video_id)) {
      setVideoPreview(formData.youtube_video_id);
    } else {
      setVideoPreview(null);
    }
  }, [formData.youtube_video_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'duration_seconds') {
      // Convert to number or null
      const numValue = value ? parseInt(value, 10) : null;
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else if (name === 'display_order') {
      const numValue = value ? parseInt(value, 10) : 0;
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleYouTubeUrlPaste = async (input: string) => {
    const videoId = extractYouTubeVideoId(input);

    if (!videoId) {
      setValidationErrors((prev) => ({
        ...prev,
        youtube_video_id: 'Invalid YouTube URL or video ID',
      }));
      return;
    }

    // Set the video ID
    setFormData((prev) => ({ ...prev, youtube_video_id: videoId }));

    // Try to fetch metadata
    setIsFetchingMetadata(true);
    try {
      const metadata = await fetchYouTubeMetadata(videoId);

      if (metadata) {
        // Auto-fill title and artist if empty
        if (!formData.title) {
          setFormData((prev) => ({ ...prev, title: metadata.title }));
        }
        if (!formData.artist) {
          setFormData((prev) => ({ ...prev, artist: metadata.author_name }));
        }
        // Use thumbnail as album cover if not set
        if (!formData.album_cover_url) {
          setFormData((prev) => ({ ...prev, album_cover_url: metadata.thumbnail_url }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch metadata:', err);
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.artist.trim()) {
      errors.artist = 'Artist is required';
    }

    if (!formData.youtube_video_id.trim()) {
      errors.youtube_video_id = 'YouTube video ID is required';
    } else if (!isValidYouTubeVideoId(formData.youtube_video_id)) {
      errors.youtube_video_id = 'Invalid YouTube video ID format';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fix the validation errors');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert tags string to array
      const tagsArray =
        formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0) || null;

      const payload = {
        ...formData,
        tags: tagsArray,
        album_cover_url: formData.album_cover_url || null,
        release_date: formData.release_date || null,
        description: formData.description || null,
        spotify_url: formData.spotify_url || null,
        apple_music_url: formData.apple_music_url || null,
        duration_seconds: formData.duration_seconds || null,
      };

      let result: Song;
      if (isEditing) {
        result = await updateSong(song.id, payload);
      } else {
        result = await createSong(payload);
      }

      onSuccess(result);
    } catch (err) {
      console.error('Error saving song:', err);
      setError(err instanceof Error ? err.message : 'Failed to save song');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-secondary rounded-lg border border-gray-800 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary">
          {isEditing ? 'Edit Song' : 'Add New Song'}
        </h2>
        <p className="text-text-secondary text-sm mt-1">
          {isEditing
            ? 'Update song information and settings'
            : 'Add a new track to your music collection'}
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* YouTube Video ID Section */}
        <div className="bg-background-primary/50 border border-gray-700 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold text-accent-blue">YouTube Video</h3>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              YouTube URL or Video ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="youtube_video_id"
              value={formData.youtube_video_id}
              onChange={(e) => handleInputChange(e)}
              onBlur={(e) => handleYouTubeUrlPaste(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or dQw4w9WgXcQ"
              className={`w-full px-4 py-2 bg-background-primary border ${
                validationErrors.youtube_video_id ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue`}
            />
            {validationErrors.youtube_video_id && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.youtube_video_id}</p>
            )}
            {isFetchingMetadata && (
              <p className="text-accent-teal text-xs mt-1">Fetching video metadata...</p>
            )}
          </div>

          {videoPreview && (
            <div>
              <p className="text-sm text-text-secondary mb-2">Preview:</p>
              <div className="aspect-video bg-background-primary rounded-lg overflow-hidden">
                <img
                  src={getYouTubeThumbnailUrl(videoPreview, 'high')}
                  alt="Video preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Song title"
              className={`w-full px-4 py-2 bg-background-primary border ${
                validationErrors.title ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue`}
            />
            {validationErrors.title && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Artist <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              placeholder="Artist name"
              className={`w-full px-4 py-2 bg-background-primary border ${
                validationErrors.artist ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue`}
            />
            {validationErrors.artist && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.artist}</p>
            )}
          </div>
        </div>

        {/* Content Type and Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Content Type
            </label>
            <select
              name="content_type"
              value={formData.content_type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
            >
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-2 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Duration (seconds)
            </label>
            <input
              type="number"
              name="duration_seconds"
              value={formData.duration_seconds || ''}
              onChange={handleInputChange}
              min="0"
              placeholder="Optional"
              className="w-full px-4 py-2 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
          </div>
        </div>

        {/* Album Cover URL */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Album Cover URL
          </label>
          <input
            type="text"
            name="album_cover_url"
            value={formData.album_cover_url}
            onChange={handleInputChange}
            placeholder="https://example.com/cover.jpg (optional, uses YouTube thumbnail if empty)"
            className="w-full px-4 py-2 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
          {formData.album_cover_url && (
            <div className="mt-2">
              <img
                src={formData.album_cover_url}
                alt="Album cover preview"
                className="w-32 h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Release Date */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Release Date</label>
          <input
            type="date"
            name="release_date"
            value={formData.release_date}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            placeholder="Optional description about the song"
            className="w-full px-4 py-2 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="pop, acoustic, cover, original"
            className="w-full px-4 py-2 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
        </div>

        {/* Streaming Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Spotify URL</label>
            <input
              type="text"
              name="spotify_url"
              value={formData.spotify_url}
              onChange={handleInputChange}
              placeholder="https://open.spotify.com/track/..."
              className="w-full px-4 py-2 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Apple Music URL
            </label>
            <input
              type="text"
              name="apple_music_url"
              value={formData.apple_music_url}
              onChange={handleInputChange}
              placeholder="https://music.apple.com/..."
              className="w-full px-4 py-2 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
          </div>
        </div>

        {/* Status Checkboxes */}
        <div className="flex flex-wrap gap-6 bg-background-primary/50 border border-gray-700 rounded-lg p-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-4 h-4 text-accent-blue bg-background-primary border-gray-700 rounded focus:ring-accent-blue focus:ring-2"
            />
            <span className="text-sm text-text-primary">Active (visible to public)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleInputChange}
              className="w-4 h-4 text-accent-blue bg-background-primary border-gray-700 rounded focus:ring-accent-blue focus:ring-2"
            />
            <span className="text-sm text-text-primary">
              Featured (only one song can be featured at a time)
            </span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-600 text-text-secondary hover:text-text-primary rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-accent-blue hover:bg-accent-teal text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Song' : 'Create Song'}
          </button>
        </div>
      </form>
    </div>
  );
}
