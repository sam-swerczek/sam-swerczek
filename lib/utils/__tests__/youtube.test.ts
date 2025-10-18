import {
  extractYouTubeVideoId,
  isValidYouTubeVideoId,
  getYouTubeThumbnailUrl,
  getYouTubeEmbedUrl,
  getYouTubeWatchUrl,
  formatDuration,
  fetchYouTubeMetadata,
  validateYouTubeVideo,
} from '../youtube';

describe('YouTube utilities', () => {
  describe('extractYouTubeVideoId', () => {
    it('extracts ID from standard watch URL', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('extracts ID from short youtu.be URL', () => {
      expect(extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('extracts ID from embed URL', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('extracts ID from /v/ URL', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/v/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('returns the ID if input is already a valid ID', () => {
      expect(extractYouTubeVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('extracts ID from URL with additional parameters', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=share')).toBe('dQw4w9WgXcQ');
    });

    it('handles URLs with whitespace', () => {
      expect(extractYouTubeVideoId('  https://youtu.be/dQw4w9WgXcQ  ')).toBe('dQw4w9WgXcQ');
    });

    it('returns null for invalid input', () => {
      expect(extractYouTubeVideoId('')).toBeNull();
      expect(extractYouTubeVideoId('not-a-url')).toBeNull();
      expect(extractYouTubeVideoId('https://example.com')).toBeNull();
    });

    it('returns null for non-string input', () => {
      expect(extractYouTubeVideoId(null as any)).toBeNull();
      expect(extractYouTubeVideoId(undefined as any)).toBeNull();
    });
  });

  describe('isValidYouTubeVideoId', () => {
    it('returns true for valid video IDs', () => {
      expect(isValidYouTubeVideoId('dQw4w9WgXcQ')).toBe(true);
      expect(isValidYouTubeVideoId('abcdefghijk')).toBe(true);
      expect(isValidYouTubeVideoId('ABC-_123456')).toBe(true);
    });

    it('returns false for invalid video IDs', () => {
      expect(isValidYouTubeVideoId('short')).toBe(false);
      expect(isValidYouTubeVideoId('toolongvideoid')).toBe(false);
      expect(isValidYouTubeVideoId('invalid@char')).toBe(false);
      expect(isValidYouTubeVideoId('')).toBe(false);
    });
  });

  describe('getYouTubeThumbnailUrl', () => {
    it('generates default quality thumbnail URL', () => {
      expect(getYouTubeThumbnailUrl('dQw4w9WgXcQ', 'default')).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg'
      );
    });

    it('generates medium quality thumbnail URL', () => {
      expect(getYouTubeThumbnailUrl('dQw4w9WgXcQ', 'medium')).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg'
      );
    });

    it('generates high quality thumbnail URL', () => {
      expect(getYouTubeThumbnailUrl('dQw4w9WgXcQ', 'high')).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
      );
    });

    it('generates maxres quality thumbnail URL', () => {
      expect(getYouTubeThumbnailUrl('dQw4w9WgXcQ', 'maxres')).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
      );
    });

    it('defaults to high quality when not specified', () => {
      expect(getYouTubeThumbnailUrl('dQw4w9WgXcQ')).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
      );
    });
  });

  describe('getYouTubeEmbedUrl', () => {
    it('generates embed URL without autoplay', () => {
      const url = getYouTubeEmbedUrl('dQw4w9WgXcQ', false);
      expect(url).toContain('https://www.youtube.com/embed/dQw4w9WgXcQ');
      expect(url).toContain('autoplay=0');
      expect(url).toContain('modestbranding=1');
      expect(url).toContain('rel=0');
    });

    it('generates embed URL with autoplay', () => {
      const url = getYouTubeEmbedUrl('dQw4w9WgXcQ', true);
      expect(url).toContain('autoplay=1');
    });

    it('defaults to no autoplay when not specified', () => {
      const url = getYouTubeEmbedUrl('dQw4w9WgXcQ');
      expect(url).toContain('autoplay=0');
    });
  });

  describe('getYouTubeWatchUrl', () => {
    it('generates correct watch URL', () => {
      expect(getYouTubeWatchUrl('dQw4w9WgXcQ')).toBe(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      );
    });
  });

  describe('formatDuration', () => {
    it('formats seconds only', () => {
      expect(formatDuration(45)).toBe('0:45');
    });

    it('formats minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2:05');
    });

    it('formats hours, minutes, and seconds', () => {
      expect(formatDuration(3665)).toBe('1:01:05');
    });

    it('pads single digit seconds', () => {
      expect(formatDuration(65)).toBe('1:05');
    });

    it('pads single digit minutes in hour format', () => {
      expect(formatDuration(3605)).toBe('1:00:05');
    });

    it('handles zero duration', () => {
      expect(formatDuration(0)).toBe('0:00');
    });

    it('handles null duration', () => {
      expect(formatDuration(null)).toBe('--:--');
    });

    it('handles undefined duration', () => {
      expect(formatDuration(undefined as any)).toBe('--:--');
    });

    it('handles negative duration', () => {
      expect(formatDuration(-10)).toBe('--:--');
    });

    it('handles long durations', () => {
      expect(formatDuration(36000)).toBe('10:00:00');
    });
  });

  describe('fetchYouTubeMetadata', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('fetches and returns metadata successfully', async () => {
      const mockResponse = {
        title: 'Test Video',
        author_name: 'Test Author',
        thumbnail_url: 'https://example.com/thumb.jpg',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchYouTubeMetadata('dQw4w9WgXcQ');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('youtube.com/oembed')
      );
    });

    it('returns null on fetch failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      const result = await fetchYouTubeMetadata('invalid');
      expect(result).toBeNull();
    });

    it('returns null on network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchYouTubeMetadata('dQw4w9WgXcQ');
      expect(result).toBeNull();
    });

    it('handles missing fields in response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await fetchYouTubeMetadata('dQw4w9WgXcQ');

      expect(result).toEqual({
        title: '',
        author_name: '',
        thumbnail_url: '',
      });
    });
  });

  describe('validateYouTubeVideo', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('returns true for valid video', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          title: 'Test Video',
          author_name: 'Test Author',
          thumbnail_url: 'https://example.com/thumb.jpg',
        }),
      });

      const result = await validateYouTubeVideo('dQw4w9WgXcQ');
      expect(result).toBe(true);
    });

    it('returns false for invalid video ID format', async () => {
      const result = await validateYouTubeVideo('invalid');
      expect(result).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns false when metadata fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      const result = await validateYouTubeVideo('dQw4w9WgXcQ');
      expect(result).toBe(false);
    });

    it('returns false on error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await validateYouTubeVideo('dQw4w9WgXcQ');
      expect(result).toBe(false);
    });
  });
});
