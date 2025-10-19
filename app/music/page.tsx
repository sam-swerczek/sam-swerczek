import type { Metadata } from "next";
import VideoGallery from "@/components/music/video/VideoGallery";
import SocialLinks from "@/components/music/SocialLinks";
import StreamingLinks from "@/components/music/StreamingLinks";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  getConfigObject,
  extractVideosFromConfig,
  type StreamingConfig,
  type MusicSocialConfig,
  type FeaturedVideosConfig,
  type GeneralConfig,
  type Video,
} from "@/lib/supabase/config-helpers";
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
  // Fetch all required data in parallel
  const [streaming, social, videosRaw, general] = await Promise.all([
    getConfigObject<StreamingConfig>('streaming'),
    getConfigObject<MusicSocialConfig>('music_social'),
    getConfigObject<FeaturedVideosConfig>('featured_videos'),
    getConfigObject<GeneralConfig>('general'),
  ]);

  // Extract videos from config
  const videos = extractVideosFromConfig(videosRaw);

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

      <div className="container mx-auto px-4 py-12 md:py-20 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto space-y-20 md:space-y-28">

          {/* Featured Videos Section */}
          <section className="pt-4 md:pt-8">
            <VideoGallery videos={videos} />
          </section>

          {/* Streaming Platforms Section */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-blue/20 via-accent-teal/10 to-transparent border border-accent-blue/30 p-8 md:p-12">
            <div className="relative z-10">
              <SectionHeader
                title="Stream My Music"
                subtitle="Listen on your favorite platform"
                className="text-center"
              />
              <StreamingLinks
                spotifyUrl={streaming.spotify_url}
                appleMusicUrl={streaming.apple_music_url}
                youtubePlaylistUrl={streaming.youtube_music_url}
              />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/20 rounded-full blur-3xl -z-0" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-teal/10 rounded-full blur-3xl -z-0" />
          </section>


          {/* Upcoming Shows Placeholder */}
          <section>
            <SectionHeader
              title="Upcoming Shows"
              subtitle="Check back for upcoming performance dates"
              className="text-center"
            />
            <div className="bg-background-secondary/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-text-secondary/10 text-center">
              <div className="max-w-md mx-auto">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-accent-blue/40" />
                <h3 className="text-xl font-semibold mb-2">No Shows Scheduled Yet</h3>
                <p className="text-text-secondary mb-6">
                  Stay tuned for upcoming performance dates and locations. Follow me on social media to be the first to know!
                </p>
                <Button href={general.booking_email ? `mailto:${general.booking_email}` : '#'} variant="secondary" size="md">
                  Book a Show
                </Button>
              </div>
            </div>
          </section>

          {/* Patreon CTA */}
          {social.patreon_url && (
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-gold/20 via-accent-gold/10 to-transparent border border-accent-gold/30 p-8 md:p-12">
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <SectionHeader
                  title="Support My Music"
                  subtitle="Join my Patreon community for exclusive content, early releases, and behind-the-scenes access. Your support helps me create more music and content for you to enjoy."
                  className="text-center"
                />
                <Button
                  href={social.patreon_url}
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
            <SectionHeader
              title="Connect With Me"
              subtitle="Follow for updates, new releases, and upcoming shows"
              className="text-center"
            />
            <div className="bg-background-secondary/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-text-secondary/10">
              <SocialLinks
                instagramUrl={social.instagram_handle}
                facebookUrl={social.facebook_url}
                linkedinUrl={social.linkedin_music}
                tiktokUrl={social.tiktok_url}
                patreonUrl={social.patreon_url}
                layout="grid"
              />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
