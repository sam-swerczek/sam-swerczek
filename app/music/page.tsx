import type { Metadata } from "next";
import SpotifyEmbed from "@/components/music/SpotifyEmbed";
import YouTubeEmbed from "@/components/music/YouTubeEmbed";
import SocialLinks from "@/components/music/SocialLinks";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Music & Performance | Sam Swerczek",
  description: "Singer-songwriter blending acoustic storytelling with contemporary sound. Stream my music, watch live performances, and connect on social media.",
  openGraph: {
    title: "Music & Performance | Sam Swerczek",
    description: "Singer-songwriter blending acoustic storytelling with contemporary sound.",
    type: "website",
  },
};

export default function MusicPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent-blue via-accent-teal to-accent-gold bg-clip-text text-transparent">
              Music & Performance
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              Singer-songwriter blending acoustic storytelling with contemporary sound.
              <br className="hidden md:block" />
              Experience the music, watch live performances, and connect.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* Patreon CTA - Prominent placement */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-gold/20 via-accent-gold/10 to-transparent border border-accent-gold/30 p-8 md:p-12">
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Support My Music</h2>
              <p className="text-lg text-text-secondary mb-8">
                Join my Patreon community for exclusive content, early releases, and behind-the-scenes access.
                Your support helps me create more music and content for you to enjoy.
              </p>
              <Button
                href="#"
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

          {/* Spotify Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Listen on Spotify</h2>
              <p className="text-text-secondary text-lg">
                Stream my latest tracks and playlists
              </p>
            </div>
            <div className="bg-background-secondary/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-text-secondary/10">
              <SpotifyEmbed
                url="https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4"
                type="artist"
                height="380"
              />
            </div>
          </section>

          {/* YouTube Videos Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Performances</h2>
              <p className="text-text-secondary text-lg">
                Watch live sessions and music videos
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background-secondary/50 backdrop-blur-sm p-4 rounded-2xl border border-text-secondary/10">
                <YouTubeEmbed
                  videoId="dQw4w9WgXcQ"
                  title="Live Acoustic Session - Original Song"
                />
              </div>
              <div className="bg-background-secondary/50 backdrop-blur-sm p-4 rounded-2xl border border-text-secondary/10">
                <YouTubeEmbed
                  videoId="jNQXAC9IVRw"
                  title="Performance at Local Venue"
                />
              </div>
              <div className="bg-background-secondary/50 backdrop-blur-sm p-4 rounded-2xl border border-text-secondary/10">
                <YouTubeEmbed
                  videoId="9bZkp7q19f0"
                  title="Studio Session - Behind the Scenes"
                />
              </div>
              <div className="bg-background-secondary/50 backdrop-blur-sm p-4 rounded-2xl border border-text-secondary/10">
                <YouTubeEmbed
                  videoId="kJQP7kiw5Fk"
                  title="Cover Performance"
                />
              </div>
            </div>
          </section>

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
                instagramUrl="#"
                facebookUrl="#"
                linkedinUrl="#"
                tiktokUrl="#"
                layout="grid"
              />
            </div>
          </section>

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
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-accent-blue/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No Shows Scheduled Yet</h3>
                <p className="text-text-secondary mb-6">
                  Stay tuned for upcoming performance dates and locations. Follow me on social media to be the first to know!
                </p>
                <Button href="#" variant="secondary" size="md">
                  Book a Show
                </Button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
