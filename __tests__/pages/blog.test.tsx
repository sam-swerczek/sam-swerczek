import { render, screen } from '@testing-library/react';
import BlogPage from '@/app/blog/page';
import type { Post } from '@/lib/types';

// Mock data defined before jest.mock
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Test Post 1',
    slug: 'test-post-1',
    excerpt: 'This is a test post excerpt',
    content: '# Test Post\n\nContent here',
    tags: ['javascript', 'testing'],
    published: true,
    published_at: '2024-01-01',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    title: 'Test Post 2',
    slug: 'test-post-2',
    excerpt: 'Another test post',
    content: '# Another Post\n\nMore content',
    tags: ['typescript', 'testing'],
    published: true,
    published_at: '2024-01-02',
    created_at: '2024-01-02',
    updated_at: '2024-01-02',
  },
];

const mockTags = ['javascript', 'typescript', 'testing'];

// Mock the BlogClient component
jest.mock('@/app/blog/BlogClient', () => {
  return function MockBlogClient({ initialPosts, allTags }: { initialPosts: Post[]; allTags: string[] }) {
    return (
      <div data-testid="blog-client">
        <div data-testid="posts-count">{initialPosts.length} posts</div>
        <div data-testid="tags-count">{allTags.length} tags</div>
        <ul>
          {initialPosts.map(post => (
            <li key={post.id} data-testid={`post-${post.id}`}>
              {post.title}
            </li>
          ))}
        </ul>
      </div>
    );
  };
});

// Mock Supabase queries
jest.mock('@/lib/supabase/queries', () => ({
  getPublishedPosts: jest.fn(() => Promise.resolve(mockPosts)),
  getAllTags: jest.fn(() => Promise.resolve(mockTags)),
}));

describe('Blog Page Integration', () => {
  it('renders the blog client component', async () => {
    const BlogResolved = await BlogPage();
    render(BlogResolved);

    expect(screen.getByTestId('blog-client')).toBeInTheDocument();
  });

  it('passes initial posts to blog client', async () => {
    const BlogResolved = await BlogPage();
    render(BlogResolved);

    expect(screen.getByTestId('posts-count')).toHaveTextContent('2 posts');
  });

  it('passes all tags to blog client', async () => {
    const BlogResolved = await BlogPage();
    render(BlogResolved);

    expect(screen.getByTestId('tags-count')).toHaveTextContent('3 tags');
  });

  it('displays all post titles', async () => {
    const BlogResolved = await BlogPage();
    render(BlogResolved);

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
  });

  it('renders each post with correct id', async () => {
    const BlogResolved = await BlogPage();
    render(BlogResolved);

    expect(screen.getByTestId('post-1')).toBeInTheDocument();
    expect(screen.getByTestId('post-2')).toBeInTheDocument();
  });
});
