import type { Metadata } from "next";
import YouTubeEmbed from "@/components/music/YouTubeEmbed";
import YouTubePlayerFull from "@/components/music/YouTubePlayerFull";
import SocialLinks from "@/components/music/SocialLinks";
import StreamingLinks from "@/components/music/StreamingLinks";
import Button from "@/components/ui/Button";
import { getSiteConfig, getSongs } from "@/lib/supabase/queries";
import { CalendarIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Music & Performance | Sam Swerczek",
  description: "Singer-songwriter blending acoustic storytelling with contemporary sound. Stream my music, watch live performances, and connect on social media.",
  openGraph: {
    title: "Music & Performance | Sam Swerczek",
    description: "Singer-songwriter blending acoustic storytelling with contemporary sound.",
    type: "website",
  },
};

// Disable caching to always fetch fresh config
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MusicPage() {
  // Fetch site config and songs from Supabase
  const [streamingConfig, socialsConfig, videosConfig, generalConfig, songs] = await Promise.all([
    getSiteConfig('streaming'),
    getSiteConfig('music_social'),
    getSiteConfig('featured_videos'),
    getSiteConfig('general'),
    getSongs()
  ]);

  // Extract URLs from config
  const spotifyUrl = streamingConfig.find(c => c.key === 'spotify_url')?.value;
  const appleMusicUrl = streamingConfig.find(c => c.key === 'apple_music_url')?.value;
  const youtubePlaylistUrl = streamingConfig.find(c => c.key === 'youtube_music_url')?.value;

  const instagramUrl = socialsConfig.find(c => c.key === 'instagram_handle')?.value;
  const facebookUrl = socialsConfig.find(c => c.key === 'facebook_url')?.value;
  const linkedinUrl = socialsConfig.find(c => c.key === 'linkedin_music')?.value;
  const tiktokUrl = socialsConfig.find(c => c.key === 'tiktok_url')?.value;
  const patreonUrl = socialsConfig.find(c => c.key === 'patreon_url')?.value;

  const bookingEmail = generalConfig.find(c => c.key === 'booking_email')?.value;

  // Get album cover (profile image)
  const albumCoverUrl = generalConfig.find(c => c.key === 'profile_image_url')?.value;

  // Extract YouTube video IDs and titles
  const videos = [
    {
      id: videosConfig.find(c => c.key === 'youtube_video_1')?.value,
      title: videosConfig.find(c => c.key === 'youtube_video_1_title')?.value
    },
    {
      id: videosConfig.find(c => c.key === 'youtube_video_2')?.value,
      title: videosConfig.find(c => c.key === 'youtube_video_2_title')?.value
    },
    {
      id: videosConfig.find(c => c.key === 'youtube_video_3')?.value,
      title: videosConfig.find(c => c.key === 'youtube_video_3_title')?.value
    },
    {
      id: videosConfig.find(c => c.key === 'youtube_video_4')?.value,
      title: videosConfig.find(c => c.key === 'youtube_video_4_title')?.value
    },
  ].filter(video => Boolean(video.id));
  return (
    <div className="min-h-screen relative">
      {/* Subtle music-themed background - left side only, fades to right and bottom */}
      <div className="absolute top-0 left-0 right-0 h-screen -z-10 overflow-hidden pointer-events-none hidden md:block">
        {/* Left side - Music */}
        <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80)',
              filter: 'blur(3px) brightness(0.6)',
            }}
          />
          {/* Gradient fade to right */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background-primary" />
          {/* Gradient fade to bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-primary/50 via-60% to-background-primary" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* Featured Music Player */}
          <section>
            <YouTubePlayerFull songs={songs} />
          </section>

          {/* Streaming Platforms Section */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-blue/20 via-accent-teal/10 to-transparent border border-accent-blue/30 p-8 md:p-12">
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Stream My Music</h2>
                <p className="text-lg md:text-xl text-text-secondary">
                  Listen on your favorite platform
                </p>
              </div>
              <StreamingLinks
                spotifyUrl={spotifyUrl}
                appleMusicUrl={appleMusicUrl}
                youtubePlaylistUrl={youtubePlaylistUrl}
              />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/20 rounded-full blur-3xl -z-0" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-teal/10 rounded-full blur-3xl -z-0" />
          </section>

          {/* YouTube Videos Section */}
          {videos.length > 0 && (
            <section>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Performances</h2>
                <p className="text-text-secondary text-lg">
                  Watch live sessions and music videos
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="bg-background-secondary/50 backdrop-blur-sm p-4 rounded-2xl border border-text-secondary/10">
                    <YouTubeEmbed
                      videoId={video.id!}
                      title={video.title || 'YouTube Video'}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Shows Placeholder */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Upcoming Shows</h2>
              <p className="text-text-secondary text-lg">
                Check back for upcoming performance dates
              </p>
            </div>
            <div className="bg-background-secondary/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-text-secondary/10 text-center">
              <div className="max-w-md mx-auto">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-accent-blue/40" />
                <h3 className="text-xl font-semibold mb-2">No Shows Scheduled Yet</h3>
                <p className="text-text-secondary mb-6">
                  Stay tuned for upcoming performance dates and locations. Follow me on social media to be the first to know!
                </p>
                <Button href={bookingEmail ? `mailto:${bookingEmail}` : '#'} variant="secondary" size="md">
                  Book a Show
                </Button>
              </div>
            </div>
          </section>

          {/* Patreon CTA */}
          {patreonUrl && (
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-gold/20 via-accent-gold/10 to-transparent border border-accent-gold/30 p-8 md:p-12">
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Support My Music</h2>
                <p className="text-lg text-text-secondary mb-8">
                  Join my Patreon community for exclusive content, early releases, and behind-the-scenes access.
                  Your support helps me create more music and content for you to enjoy.
                </p>
                <Button
                  href={patreonUrl}
                  variant="accent"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Become a Patron
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/20 rounded-full blur-3xl -z-0" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl -z-0" />
            </section>
          )}

          {/* Social Media Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Connect With Me</h2>
              <p className="text-text-secondary text-lg">
                Follow for updates, new releases, and upcoming shows
              </p>
            </div>
            <div className="bg-background-secondary/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-text-secondary/10">
              <SocialLinks
                instagramUrl={instagramUrl}
                facebookUrl={facebookUrl}
                linkedinUrl={linkedinUrl}
                tiktokUrl={tiktokUrl}
                patreonUrl={patreonUrl}
                layout="grid"
              />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
