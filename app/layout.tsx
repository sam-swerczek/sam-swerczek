import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import YouTubePlayerContainer from "@/components/music/YouTubePlayerContainer";
import FeaturedSongInitializer from "@/components/music/FeaturedSongInitializer";
import { YouTubePlayerProvider } from "@/lib/contexts/YouTubePlayerContext";
import { getSongs, getFeaturedSong, getSiteConfig } from "@/lib/supabase/queries";
import { getConfigObject, type MusicSocialConfig, type EngineeringSocialConfig, type StreamingConfig } from "@/lib/supabase/config-helpers";
import LayoutClient from "@/components/layout/LayoutClient";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-montserrat"
});

export const metadata: Metadata = {
  title: "Sam Swerczek | Singer-Songwriter & Software Engineer",
  description: "Personal website of Sam Swerczek - showcasing music, engineering projects, and blog posts",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch all songs, featured song, configs, and hero image in parallel
  const [songs, featuredSong, musicSocial, engineeringSocial, streaming, generalConfig] = await Promise.all([
    getSongs(),
    getFeaturedSong(),
    getConfigObject<MusicSocialConfig>('music_social'),
    getConfigObject<EngineeringSocialConfig>('engineering_social'),
    getConfigObject<StreamingConfig>('streaming'),
    getSiteConfig('general'),
  ]);

  const heroImageUrl = generalConfig.find(c => c.key === 'hero_image_url')?.value;

  return (
    <html lang="en">
      <body className={`${inter.className} ${montserrat.variable}`}>
        <YouTubePlayerProvider>
          {/* Initialize player with featured song and full playlist */}
          <FeaturedSongInitializer featuredSong={featuredSong} songs={songs} />
          <LayoutClient
            siteData={{
              heroImageUrl,
              musicSocial,
              engineeringSocial,
              streaming,
            }}
          >
            {children}
          </LayoutClient>
          {/* Hidden YouTube player container - persists across all pages */}
          <YouTubePlayerContainer />
        </YouTubePlayerProvider>
      </body>
    </html>
  );
}
