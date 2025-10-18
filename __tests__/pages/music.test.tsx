import { render, screen } from '@testing-library/react';
import MusicPage from '@/app/music/page';
import type { Song } from '@/lib/types';

// Mock child components
jest.mock('@/components/music/YouTubePlayerFull', () => {
  return function MockYouTubePlayer({ songs }: { songs: Song[] }) {
    return (
      <div data-testid="youtube-player">
        YouTube Player ({songs.length} songs)
      </div>
    );
  };
});

jest.mock('@/components/music/StreamingLinks', () => {
  return function MockStreamingLinks() {
    return <div data-testid="streaming-links">Streaming Links</div>;
  };
});

jest.mock('@/components/music/YouTubeEmbed', () => {
  return function MockYouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
    return (
      <div data-testid={`youtube-embed-${videoId}`}>
        {title}
      </div>
    );
  };
});

jest.mock('@/components/music/SocialLinks', () => {
  return function MockSocialLinks({ layout }: { layout: string }) {
    return <div data-testid="social-links" data-layout={layout}>Social Links</div>;
  };
});

jest.mock('@/components/ui/Button', () => {
  return function MockButton({ children, href }: { children: React.ReactNode; href?: string }) {
    return <a href={href} data-testid="button">{children}</a>;
  };
});

jest.mock('@/components/ui/icons', () => ({
  CalendarIcon: () => <div data-testid="calendar-icon">Calendar</div>,
}));

// Mock Supabase queries
const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Test Song 1',
    youtube_video_id: 'video1',
    artist: 'Test Artist',
    display_order: 1,
    is_active: true,
    is_featured: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    title: 'Test Song 2',
    youtube_video_id: 'video2',
    artist: 'Test Artist',
    display_order: 2,
    is_active: true,
    is_featured: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

jest.mock('@/lib/supabase/queries', () => ({
  getSiteConfig: jest.fn().mockImplementation((category: string) => {
    const configs = {
      streaming: [
        { key: 'spotify_url', value: 'https://spotify.com/test' },
        { key: 'apple_music_url', value: 'https://music.apple.com/test' },
        { key: 'youtube_music_url', value: 'https://youtube.com/test' },
      ],
      music_social: [
        { key: 'instagram_handle', value: 'https://instagram.com/test' },
        { key: 'facebook_url', value: 'https://facebook.com/test' },
      ],
      featured_videos: [
        { key: 'youtube_video_1', value: 'vid1' },
        { key: 'youtube_video_1_title', value: 'Video 1' },
        { key: 'youtube_video_2', value: 'vid2' },
        { key: 'youtube_video_2_title', value: 'Video 2' },
      ],
      general: [
        { key: 'booking_email', value: 'booking@test.com' },
        { key: 'profile_image_url', value: 'https://example.com/image.jpg' },
      ],
    };
    return Promise.resolve(configs[category as keyof typeof configs] || []);
  }),
  getSongs: jest.fn().mockResolvedValue(mockSongs),
}));

describe('Music Page Integration', () => {
  it('renders all main sections', async () => {
    const MusicResolved = await MusicPage();
    render(MusicResolved);

    // Main sections
    expect(screen.getByTestId('youtube-player')).toBeInTheDocument();
    expect(screen.getByTestId('streaming-links')).toBeInTheDocument();
    expect(screen.getByTestId('social-links')).toBeInTheDocument();
  });

  it('passes songs to YouTube player', async () => {
    const MusicResolved = await MusicPage();
    render(MusicResolved);

    const player = screen.getByTestId('youtube-player');
    expect(player).toHaveTextContent('2 songs');
  });

  it('renders streaming platform section heading', async () => {
    const MusicResolved = await MusicPage();
    render(MusicResolved);

    expect(screen.getByText('Stream My Music')).toBeInTheDocument();
  });

  it('renders featured performances section', async () => {
    const MusicResolved = await MusicPage();
    render(MusicResolved);

    expect(screen.getByText('Featured Performances')).toBeInTheDocument();
    expect(screen.getByTestId('youtube-embed-vid1')).toBeInTheDocument();
    expect(screen.getByTestId('youtube-embed-vid2')).toBeInTheDocument();
  });

  it('renders upcoming shows section', async () => {
    const MusicResolved = await MusicPage();
    render(MusicResolved);

    expect(screen.getByText('Upcoming Shows')).toBeInTheDocument();
    expect(screen.getByText('No Shows Scheduled Yet')).toBeInTheDocument();
  });

  it('renders book a show button with email link', async () => {
    const MusicResolved = await MusicPage();
    render(MusicResolved);

    const button = screen.getByText('Book a Show').closest('a');
    expect(button).toHaveAttribute('href', 'mailto:booking@test.com');
  });

  it('renders connect section with grid layout', async () => {
    const MusicResolved = await MusicPage();
    render(MusicResolved);

    const socialLinks = screen.getByTestId('social-links');
    expect(socialLinks).toHaveAttribute('data-layout', 'grid');
  });
});
