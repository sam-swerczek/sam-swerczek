'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Song } from '@/lib/types';
import { Alert } from '@/components/ui/Alert';
import SongForm from '@/components/admin/SongForm';
import { getYouTubeThumbnailUrl, formatDuration } from '@/lib/utils/youtube';
import { getAllSongs, deleteSong, setFeaturedSong, reorderSongs } from '@/lib/supabase/mutations';

interface SongsAdminClientProps {
  initialSongs: Song[];
}

type FilterType = 'all' | 'audio' | 'video' | 'active' | 'inactive' | 'featured';
type ViewMode = 'list' | 'form';

export default function SongsAdminClient({ initialSongs }: SongsAdminClientProps) {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter songs based on selected filter
  const filteredSongs = useMemo(() => {
    let filtered = [...songs];

    switch (filter) {
      case 'audio':
        filtered = filtered.filter((s) => s.content_type === 'audio');
        break;
      case 'video':
        filtered = filtered.filter((s) => s.content_type === 'video');
        break;
      case 'active':
        filtered = filtered.filter((s) => s.is_active);
        break;
      case 'inactive':
        filtered = filtered.filter((s) => !s.is_active);
        break;
      case 'featured':
        filtered = filtered.filter((s) => s.is_featured);
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => a.display_order - b.display_order);
  }, [songs, filter]);

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleAddNew = () => {
    setEditingSong(null);
    setViewMode('form');
  };

  const handleEdit = (song: Song) => {
    setEditingSong(song);
    setViewMode('form');
  };

  const handleCancelForm = () => {
    setEditingSong(null);
    setViewMode('list');
  };

  const handleFormSuccess = async (song: Song) => {
    // Refresh songs list
    try {
      const updatedSongs = await getAllSongs();
      setSongs(updatedSongs);
    } catch (err) {
      console.error('Error refreshing songs:', err);
    }

    setEditingSong(null);
    setViewMode('list');
    showSuccess(editingSong ? 'Song updated successfully!' : 'Song created successfully!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this song? It will be marked as inactive.')) {
      return;
    }

    setIsDeleting(id);

    try {
      await deleteSong(id);

      // Remove from local state or mark as inactive
      setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: false } : s)));
      showSuccess('Song deleted successfully');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to delete song');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await setFeaturedSong(id);

      // Refresh songs
      const updatedSongs = await getAllSongs();
      setSongs(updatedSongs);

      showSuccess('Featured song updated');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update featured song');
    }
  };

  const handleMoveUp = async (song: Song) => {
    const currentIndex = filteredSongs.findIndex((s) => s.id === song.id);
    if (currentIndex <= 0) return;

    const previousSong = filteredSongs[currentIndex - 1];

    try {
      await reorderSongs([
        { id: song.id, display_order: previousSong.display_order },
        { id: previousSong.id, display_order: song.display_order },
      ]);

      // Refresh songs
      const updatedSongs = await getAllSongs();
      setSongs(updatedSongs);
    } catch (err) {
      showError('Failed to reorder songs');
    }
  };

  const handleMoveDown = async (song: Song) => {
    const currentIndex = filteredSongs.findIndex((s) => s.id === song.id);
    if (currentIndex >= filteredSongs.length - 1) return;

    const nextSong = filteredSongs[currentIndex + 1];

    try {
      await reorderSongs([
        { id: song.id, display_order: nextSong.display_order },
        { id: nextSong.id, display_order: song.display_order },
      ]);

      // Refresh songs
      const updatedSongs = await getAllSongs();
      setSongs(updatedSongs);
    } catch (err) {
      showError('Failed to reorder songs');
    }
  };

  if (viewMode === 'form') {
    return (
      <div>
        <button
          onClick={handleCancelForm}
          className="mb-4 text-accent-blue hover:text-accent-teal transition-colors"
        >
          &larr; Back to Songs List
        </button>

        <SongForm song={editingSong} onSuccess={handleFormSuccess} onCancel={handleCancelForm} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="animate-in fade-in duration-200">
          <Alert type="success" message={success} />
        </div>
      )}
      {error && <Alert type="error" message={error} />}

      {/* Top Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background-secondary rounded-lg border border-gray-800 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-accent-blue text-white'
                : 'bg-background-primary text-text-secondary hover:text-text-primary'
            }`}
          >
            All ({songs.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-accent-blue text-white'
                : 'bg-background-primary text-text-secondary hover:text-text-primary'
            }`}
          >
            Active ({songs.filter((s) => s.is_active).length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'inactive'
                ? 'bg-accent-blue text-white'
                : 'bg-background-primary text-text-secondary hover:text-text-primary'
            }`}
          >
            Inactive ({songs.filter((s) => !s.is_active).length})
          </button>
          <button
            onClick={() => setFilter('audio')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'audio'
                ? 'bg-accent-blue text-white'
                : 'bg-background-primary text-text-secondary hover:text-text-primary'
            }`}
          >
            Audio ({songs.filter((s) => s.content_type === 'audio').length})
          </button>
          <button
            onClick={() => setFilter('video')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'video'
                ? 'bg-accent-blue text-white'
                : 'bg-background-primary text-text-secondary hover:text-text-primary'
            }`}
          >
            Video ({songs.filter((s) => s.content_type === 'video').length})
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'featured'
                ? 'bg-accent-blue text-white'
                : 'bg-background-primary text-text-secondary hover:text-text-primary'
            }`}
          >
            Featured ({songs.filter((s) => s.is_featured).length})
          </button>
        </div>

        <button
          onClick={handleAddNew}
          className="px-6 py-2 bg-accent-blue hover:bg-accent-teal text-white rounded-lg font-semibold transition-colors whitespace-nowrap"
        >
          + Add New Song
        </button>
      </div>

      {/* Songs Table */}
      <div className="bg-background-secondary rounded-lg border border-gray-800 overflow-hidden">
        {filteredSongs.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            <p className="text-lg">No songs found</p>
            <p className="text-sm mt-2">
              {filter !== 'all' ? 'Try changing the filter or ' : ''}Click &quot;Add New Song&quot;
              to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-primary border-b border-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">
                    Order
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">
                    Thumbnail
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">
                    Title / Artist
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">
                    Duration
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredSongs.map((song, index) => (
                  <tr
                    key={song.id}
                    className={`hover:bg-background-primary/50 transition-colors ${
                      !song.is_active ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-text-secondary text-sm">{song.display_order}</span>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveUp(song)}
                            disabled={index === 0}
                            className="text-text-secondary hover:text-accent-blue disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleMoveDown(song)}
                            disabled={index === filteredSongs.length - 1}
                            className="text-text-secondary hover:text-accent-blue disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative w-16 h-16 bg-background-primary rounded overflow-hidden">
                        <Image
                          src={
                            song.album_cover_url ||
                            getYouTubeThumbnailUrl(song.youtube_video_id, 'default')
                          }
                          alt={song.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="min-w-[200px]">
                        <div className="font-medium text-text-primary">{song.title}</div>
                        <div className="text-sm text-text-secondary">{song.artist}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          song.content_type === 'video'
                            ? 'bg-purple-900/30 text-purple-400 border border-purple-700'
                            : 'bg-blue-900/30 text-blue-400 border border-blue-700'
                        }`}
                      >
                        {song.content_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-text-secondary">
                        {formatDuration(song.duration_seconds)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            song.is_active
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-gray-900/30 text-gray-400'
                          }`}
                        >
                          {song.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {song.is_featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900/30 text-yellow-400">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleFeatured(song.id)}
                          className="text-xs text-accent-blue hover:text-accent-teal transition-colors"
                          title={song.is_featured ? 'Unfeature' : 'Set as featured'}
                        >
                          {song.is_featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          onClick={() => handleEdit(song)}
                          className="text-xs text-accent-blue hover:text-accent-teal transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(song.id)}
                          disabled={isDeleting === song.id}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                        >
                          {isDeleting === song.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
