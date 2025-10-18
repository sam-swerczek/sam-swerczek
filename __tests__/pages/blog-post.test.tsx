import { render, screen } from '@testing-library/react';
import BlogPostPage from '@/app/blog/[slug]/page';
import { notFound } from 'next/navigation';
import type { Post } from '@/lib/types';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock child components
jest.mock('@/components/blog/PostContent', () => {
  return function MockPostContent({ content }: { content: string }) {
    return <div data-testid="post-content">{content}</div>;
  };
});

jest.mock('@/components/blog/TagsList', () => {
  return function MockTagsList({ tags }: { tags: string[] }) {
    return (
      <div data-testid="tags-list">
        {tags.map(tag => <span key={tag}>{tag}</span>)}
      </div>
    );
  };
});

// Mock post data
const mockPost: Post = {
  id: '1',
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  excerpt: 'This is a test excerpt',
  content: '# Test Content\n\nThis is the post content.',
  tags: ['javascript', 'testing'],
  published: true,
  published_at: '2024-01-15T10:00:00Z',
  meta_description: 'Test meta description',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
};

const mockRelatedPosts: Post[] = [
  {
    id: '2',
    title: 'Related Post 1',
    slug: 'related-post-1',
    excerpt: 'Related post excerpt 1',
    content: 'Content',
    tags: ['javascript'],
    published: true,
    published_at: '2024-01-10T10:00:00Z',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    title: 'Related Post 2',
    slug: 'related-post-2',
    excerpt: 'Related post excerpt 2',
    content: 'Content',
    tags: ['testing'],
    published: true,
    published_at: '2024-01-12T10:00:00Z',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
  },
];

// Mock Supabase queries
jest.mock('@/lib/supabase/queries', () => ({
  getPostBySlug: jest.fn().mockResolvedValue(mockPost),
  getPublishedPosts: jest.fn().mockResolvedValue([mockPost]),
  getRelatedPosts: jest.fn().mockResolvedValue(mockRelatedPosts),
  getSiteConfig: jest.fn().mockResolvedValue([
    { key: 'linkedin_url', value: 'https://linkedin.com/test' },
    { key: 'github_url', value: 'https://github.com/test' },
  ]),
}));

describe('Blog Post Page Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the post title', async () => {
    const params = Promise.resolve({ slug: 'test-blog-post' });
    const PostResolved = await BlogPostPage({ params });
    render(PostResolved);

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
  });

  it('renders the post content', async () => {
    const params = Promise.resolve({ slug: 'test-blog-post' });
    const PostResolved = await BlogPostPage({ params });
    render(PostResolved);

    expect(screen.getByTestId('post-content')).toBeInTheDocument();
    expect(screen.getByTestId('post-content')).toHaveTextContent('This is the post content');
  });

  it('renders the published date', async () => {
    const params = Promise.resolve({ slug: 'test-blog-post' });
    const PostResolved = await BlogPostPage({ params });
    render(PostResolved);

    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  });

  it('renders the author name', async () => {
    const params = Promise.resolve({ slug: 'test-blog-post' });
    const PostResolved = await BlogPostPage({ params });
    render(PostResolved);

    expect(screen.getByText('By Sam Swerczek')).toBeInTheDocument();
  });

  it('renders tags', async () => {
    const params = Promise.resolve({ slug: 'test-blog-post' });
    const PostResolved = await BlogPostPage({ params });
    render(PostResolved);

    expect(screen.getByTestId('tags-list')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
  });

  it('renders the excerpt', async () => {
    const params = Promise.resolve({ slug: 'test-blog-post' });
    const PostResolved = await BlogPostPage({ params });
    render(PostResolved);

    expect(screen.getByText('This is a test excerpt')).toBeInTheDocument();
  });

  it('renders back to blog link', async () => {
    const params = Promise.resolve({ slug: 'test-blog-post' });
    const PostResolved = await BlogPostPage({ params });
    render(PostResolved);

    const backLink = screen.getByText('Back to Blog').closest('a');
    expect(backLink).toHaveAttribute('href', '/blog');
  });

  it('renders related posts section', async () => {
    const params = Promise.resolve({ slug: 'test-blog-post' });
    const PostResolved = await BlogPostPage({ params });
    render(PostResolved);

    expect(screen.getByText('Related Posts')).toBeInTheDocument();
    expect(screen.getByText('Related Post 1')).toBeInTheDocument();
    expect(screen.getByText('Related Post 2')).toBeInTheDocument();
  });

  it('renders social share section', async () => {
    const params = Promise.resolve({ slug: 'test-blog-post' });
    const PostResolved = await BlogPostPage({ params });
    render(PostResolved);

    expect(screen.getByText(/Thanks for reading/i)).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('calls notFound when post does not exist', async () => {
    const { getPostBySlug } = require('@/lib/supabase/queries');
    getPostBySlug.mockResolvedValueOnce(null);

    const params = Promise.resolve({ slug: 'non-existent' });
    await BlogPostPage({ params });

    expect(notFound).toHaveBeenCalled();
  });

  it('calls notFound when post is not published', async () => {
    const { getPostBySlug } = require('@/lib/supabase/queries');
    getPostBySlug.mockResolvedValueOnce({ ...mockPost, published: false });

    const params = Promise.resolve({ slug: 'unpublished' });
    await BlogPostPage({ params });

    expect(notFound).toHaveBeenCalled();
  });
});
