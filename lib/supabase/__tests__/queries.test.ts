import {
  getPublishedPosts,
  getPostBySlug,
  getPublishedPostsByTag,
  getAllTags,
  getSiteConfig,
  getSiteConfigByKey,
  getFeaturedPosts,
  getRelatedPosts,
  getPublishedPostsCount,
  searchPosts,
  getMusicSocialLinks,
  getEngineeringSocialLinks,
  isSlugAvailable,
} from '../queries';
import { supabase } from '../client';
import type { Post, SiteConfig } from '../../types';

// Mock the Supabase client
jest.mock('../client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Mock console.error to avoid cluttering test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('Supabase Public Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPublishedPosts', () => {
    it('should fetch all published posts with default options', async () => {
      const mockPosts: Post[] = [
        {
          id: '1',
          title: 'Test Post 1',
          slug: 'test-post-1',
          content: 'Content 1',
          excerpt: 'Excerpt 1',
          published: true,
          published_at: '2024-01-01T00:00:00Z',
          author_id: 'author-1',
          tags: ['tech'],
          featured_image_url: null,
          meta_description: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getPublishedPosts();

      expect(supabase.from).toHaveBeenCalledWith('posts');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('published', true);
      expect(mockQuery.order).toHaveBeenCalledWith('published_at', { ascending: false });
      expect(result).toEqual(mockPosts);
    });

    it('should apply limit option when provided', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await getPublishedPosts({ limit: 5 });

      expect(mockQuery.limit).toHaveBeenCalledWith(5);
    });

    it('should apply offset and pagination when provided', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await getPublishedPosts({ offset: 10, limit: 5 });

      expect(mockQuery.range).toHaveBeenCalledWith(10, 14);
    });

    it('should filter by tags when provided', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        overlaps: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await getPublishedPosts({ tags: ['tech', 'coding'] });

      expect(mockQuery.overlaps).toHaveBeenCalledWith('tags', ['tech', 'coding']);
    });

    it('should return empty array on error', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getPublishedPosts();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getPostBySlug', () => {
    it('should fetch a post by slug successfully', async () => {
      const mockPost: Post = {
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        content: 'Content',
        excerpt: 'Excerpt',
        published: true,
        published_at: '2024-01-01T00:00:00Z',
        author_id: 'author-1',
        tags: ['tech'],
        featured_image_url: null,
        meta_description: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockPost, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getPostBySlug('test-post');

      expect(supabase.from).toHaveBeenCalledWith('posts');
      expect(mockQuery.eq).toHaveBeenCalledWith('slug', 'test-post');
      expect(mockQuery.eq).toHaveBeenCalledWith('published', true);
      expect(result).toEqual(mockPost);
    });

    it('should return null on error', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getPostBySlug('non-existent');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getPublishedPostsByTag', () => {
    it('should fetch posts by tag successfully', async () => {
      const mockPosts: Post[] = [
        {
          id: '1',
          title: 'Tech Post',
          slug: 'tech-post',
          content: 'Content',
          excerpt: 'Excerpt',
          published: true,
          published_at: '2024-01-01T00:00:00Z',
          author_id: 'author-1',
          tags: ['tech'],
          featured_image_url: null,
          meta_description: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        contains: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getPublishedPostsByTag('tech');

      expect(mockQuery.contains).toHaveBeenCalledWith('tags', ['tech']);
      expect(result).toEqual(mockPosts);
    });

    it('should return empty array on error', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        contains: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getPublishedPostsByTag('tech');

      expect(result).toEqual([]);
    });
  });

  describe('getAllTags', () => {
    it('should extract and return unique tags from all posts', async () => {
      const mockData = [
        { tags: ['tech', 'coding'] },
        { tags: ['tech', 'ai'] },
        { tags: ['coding', 'python'] },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getAllTags();

      expect(result).toEqual(['ai', 'coding', 'python', 'tech']);
    });

    it('should handle posts with no tags', async () => {
      const mockData = [
        { tags: ['tech'] },
        { tags: null },
        { tags: [] },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getAllTags();

      expect(result).toEqual(['tech']);
    });

    it('should return empty array on error', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getAllTags();

      expect(result).toEqual([]);
    });
  });

  describe('getSiteConfig', () => {
    it('should fetch all site config when no category provided', async () => {
      const mockConfig: SiteConfig[] = [
        {
          id: '1',
          key: 'site_name',
          value: 'My Site',
          category: 'general',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockResolvedValue({ data: mockConfig, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getSiteConfig();

      expect(supabase.from).toHaveBeenCalledWith('site_config');
      expect(result).toEqual(mockConfig);
    });

    it('should filter by category when provided', async () => {
      const mockConfig: SiteConfig[] = [
        {
          id: '1',
          key: 'spotify_url',
          value: 'https://spotify.com/user',
          category: 'music_social',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: mockConfig, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getSiteConfig('music_social');

      expect(mockQuery.eq).toHaveBeenCalledWith('category', 'music_social');
      expect(result).toEqual(mockConfig);
    });

    it('should return empty array on error', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getSiteConfig();

      expect(result).toEqual([]);
    });
  });

  describe('getSiteConfigByKey', () => {
    it('should fetch config by key successfully', async () => {
      const mockConfig: SiteConfig = {
        id: '1',
        key: 'site_name',
        value: 'My Site',
        category: 'general',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockConfig, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getSiteConfigByKey('site_name');

      expect(mockQuery.eq).toHaveBeenCalledWith('key', 'site_name');
      expect(result).toEqual(mockConfig);
    });

    it('should return null on error', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getSiteConfigByKey('non_existent');

      expect(result).toBeNull();
    });
  });

  describe('getFeaturedPosts', () => {
    it('should return limited number of posts (default 3)', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await getFeaturedPosts();

      expect(mockQuery.limit).toHaveBeenCalledWith(3);
    });

    it('should accept custom limit', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await getFeaturedPosts(5);

      expect(mockQuery.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('getRelatedPosts', () => {
    it('should fetch posts with overlapping tags', async () => {
      const mockPosts: Post[] = [
        {
          id: '2',
          title: 'Related Post',
          slug: 'related-post',
          content: 'Content',
          excerpt: 'Excerpt',
          published: true,
          published_at: '2024-01-01T00:00:00Z',
          author_id: 'author-1',
          tags: ['tech'],
          featured_image_url: null,
          meta_description: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        neq: jest.fn().mockReturnThis(),
        overlaps: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getRelatedPosts('1', ['tech', 'coding'], 3);

      expect(mockQuery.neq).toHaveBeenCalledWith('id', '1');
      expect(mockQuery.overlaps).toHaveBeenCalledWith('tags', ['tech', 'coding']);
      expect(mockQuery.limit).toHaveBeenCalledWith(3);
      expect(result).toEqual(mockPosts);
    });

    it('should return recent posts when no tags provided', async () => {
      const mockPosts: Post[] = [];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getRelatedPosts('1', [], 3);

      expect(result).toEqual([]);
    });

    it('should filter out current post from results', async () => {
      const mockPosts: Post[] = [
        {
          id: '1',
          title: 'Current Post',
          slug: 'current-post',
          content: 'Content',
          excerpt: 'Excerpt',
          published: true,
          published_at: '2024-01-01T00:00:00Z',
          author_id: 'author-1',
          tags: ['tech'],
          featured_image_url: null,
          meta_description: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          title: 'Related Post',
          slug: 'related-post',
          content: 'Content',
          excerpt: 'Excerpt',
          published: true,
          published_at: '2024-01-01T00:00:00Z',
          author_id: 'author-1',
          tags: ['tech'],
          featured_image_url: null,
          meta_description: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getRelatedPosts('1', [], 3);

      // Should filter out the post with id '1'
      expect(result.find(p => p.id === '1')).toBeUndefined();
    });
  });

  describe('getPublishedPostsCount', () => {
    it('should return total count of published posts', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ count: 42, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getPublishedPostsCount();

      expect(mockQuery.select).toHaveBeenCalledWith('*', { count: 'exact', head: true });
      expect(result).toBe(42);
    });

    it('should filter by tags when provided', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        overlaps: jest.fn().mockResolvedValue({ count: 10, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getPublishedPostsCount(['tech']);

      expect(mockQuery.overlaps).toHaveBeenCalledWith('tags', ['tech']);
      expect(result).toBe(10);
    });

    it('should return 0 on error', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ count: null, error: { message: 'Error' } }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getPublishedPostsCount();

      expect(result).toBe(0);
    });
  });

  describe('searchPosts', () => {
    it('should search posts by title, content, or excerpt', async () => {
      const mockPosts: Post[] = [
        {
          id: '1',
          title: 'Search Result',
          slug: 'search-result',
          content: 'Content with search term',
          excerpt: 'Excerpt',
          published: true,
          published_at: '2024-01-01T00:00:00Z',
          author_id: 'author-1',
          tags: ['tech'],
          featured_image_url: null,
          meta_description: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await searchPosts('test');

      expect(mockQuery.or).toHaveBeenCalledWith('title.ilike.%test%,content.ilike.%test%,excerpt.ilike.%test%');
      expect(result).toEqual(mockPosts);
    });

    it('should apply limit and offset options', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await searchPosts('test', { limit: 5, offset: 10 });

      expect(mockQuery.limit).toHaveBeenCalledWith(5);
      expect(mockQuery.range).toHaveBeenCalledWith(10, 14);
    });

    it('should return empty array on error', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await searchPosts('test');

      expect(result).toEqual([]);
    });
  });

  describe('getMusicSocialLinks', () => {
    it('should call getSiteConfig with music_social category', async () => {
      const mockConfig: SiteConfig[] = [
        {
          id: '1',
          key: 'spotify',
          value: 'https://spotify.com/user',
          category: 'music_social',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: mockConfig, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getMusicSocialLinks();

      expect(mockQuery.eq).toHaveBeenCalledWith('category', 'music_social');
      expect(result).toEqual(mockConfig);
    });
  });

  describe('getEngineeringSocialLinks', () => {
    it('should call getSiteConfig with engineering_social category', async () => {
      const mockConfig: SiteConfig[] = [
        {
          id: '1',
          key: 'github',
          value: 'https://github.com/user',
          category: 'engineering_social',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: mockConfig, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await getEngineeringSocialLinks();

      expect(mockQuery.eq).toHaveBeenCalledWith('category', 'engineering_social');
      expect(result).toEqual(mockConfig);
    });
  });

  describe('isSlugAvailable', () => {
    it('should return true when slug is available', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await isSlugAvailable('new-slug');

      expect(mockQuery.eq).toHaveBeenCalledWith('slug', 'new-slug');
      expect(result).toBe(true);
    });

    it('should return false when slug already exists', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [{ id: '1' }], error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await isSlugAvailable('existing-slug');

      expect(result).toBe(false);
    });

    it('should exclude specified post ID when checking', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        neq: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await isSlugAvailable('slug', 'post-id-1');

      expect(mockQuery.neq).toHaveBeenCalledWith('id', 'post-id-1');
      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await isSlugAvailable('slug');

      expect(result).toBe(false);
    });
  });
});
