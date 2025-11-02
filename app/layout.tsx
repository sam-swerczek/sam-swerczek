import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import PlayerBar from "@/components/layout/PlayerBar";
import Footer from "@/components/layout/Footer";
import YouTubePlayerContainer from "@/components/music/YouTubePlayerContainer";
import FeaturedSongInitializer from "@/components/music/FeaturedSongInitializer";
import { YouTubePlayerProvider } from "@/lib/contexts/YouTubePlayerContext";
import { getSongs, getFeaturedSong } from "@/lib/supabase/queries";
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
  // Fetch all songs, featured song, and footer configs in parallel
  const [songs, featuredSong, musicSocial, engineeringSocial, streaming] = await Promise.all([
    getSongs(),
    getFeaturedSong(),
    getConfigObject<MusicSocialConfig>('music_social'),
    getConfigObject<EngineeringSocialConfig>('engineering_social'),
    getConfigObject<StreamingConfig>('streaming'),
  ]);

  return (
    <html lang="en">
      <body className={`${inter.className} ${montserrat.variable}`}>
        <YouTubePlayerProvider>
          {/* Initialize player with featured song and full playlist */}
          <FeaturedSongInitializer featuredSong={featuredSong} songs={songs} />
          <LayoutClient
            header={
              <div className="bg-background-primary/95 border-b border-background-secondary shadow-lg">
                <Header />
                <PlayerBar />
              </div>
            }
            footer={
              <Footer
                musicSocial={musicSocial}
                engineeringSocial={engineeringSocial}
                streaming={streaming}
              />
            }
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
