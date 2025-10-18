import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PlayerBar from "@/components/layout/PlayerBar";
import YouTubePlayerContainer from "@/components/music/YouTubePlayerContainer";
import FeaturedSongInitializer from "@/components/music/FeaturedSongInitializer";
import { YouTubePlayerProvider } from "@/lib/contexts/YouTubePlayerContext";
import { getSongs, getFeaturedSong } from "@/lib/supabase/queries";

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
  // Fetch all songs and featured song to initialize the player with full playlist
  const [songs, featuredSong] = await Promise.all([
    getSongs(),
    getFeaturedSong()
  ]);

  return (
    <html lang="en">
      <body className={`${inter.className} ${montserrat.variable}`}>
        <YouTubePlayerProvider>
          {/* Initialize player with featured song and full playlist */}
          <FeaturedSongInitializer featuredSong={featuredSong} songs={songs} />
          <div className="min-h-screen flex flex-col">
            <Header />
            <PlayerBar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          {/* Hidden YouTube player container - persists across all pages */}
          <YouTubePlayerContainer />
        </YouTubePlayerProvider>
      </body>
    </html>
  );
}
