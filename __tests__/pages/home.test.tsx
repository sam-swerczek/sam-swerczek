import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the child components to focus on integration testing
jest.mock('@/components/home/HeroSection', () => {
  return function MockHeroSection() {
    return <div data-testid="hero-section">Hero Section</div>;
  };
});

jest.mock('@/components/home/FeaturedWorksShowcase', () => {
  return function MockFeaturedWorks() {
    return <div data-testid="featured-works">Featured Works</div>;
  };
});

jest.mock('@/components/home/ActivityTimeline', () => {
  return function MockActivityTimeline() {
    return <div data-testid="activity-timeline">Activity Timeline</div>;
  };
});

jest.mock('@/components/music/SocialLinks', () => {
  return function MockSocialLinks({ layout }: { layout: string }) {
    return <div data-testid="social-links" data-layout={layout}>Social Links</div>;
  };
});

// Mock Supabase queries
jest.mock('@/lib/supabase/queries', () => ({
  getSiteConfig: jest.fn().mockResolvedValue([
    { key: 'instagram_handle', value: 'https://instagram.com/test' },
    { key: 'facebook_url', value: 'https://facebook.com/test' },
    { key: 'linkedin_music', value: 'https://linkedin.com/test' },
    { key: 'tiktok_url', value: 'https://tiktok.com/test' },
    { key: 'patreon_url', value: 'https://patreon.com/test' },
  ]),
}));

describe('Home Page Integration', () => {
  it('renders all main sections', async () => {
    const HomeResolved = await Home();
    render(HomeResolved);

    // Check that all major sections are rendered
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('featured-works')).toBeInTheDocument();
    expect(screen.getByTestId('activity-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('social-links')).toBeInTheDocument();
  });

  it('renders social links with horizontal layout', async () => {
    const HomeResolved = await Home();
    render(HomeResolved);

    const socialLinks = screen.getByTestId('social-links');
    expect(socialLinks).toHaveAttribute('data-layout', 'horizontal');
  });

  it('includes Connect With Me section heading', async () => {
    const HomeResolved = await Home();
    render(HomeResolved);

    expect(screen.getByText('Connect With Me')).toBeInTheDocument();
  });

  it('includes social media section description', async () => {
    const HomeResolved = await Home();
    render(HomeResolved);

    expect(screen.getByText(/Follow for updates, new releases, and upcoming shows/i)).toBeInTheDocument();
  });
});
