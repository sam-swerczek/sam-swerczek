import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PlayerBar from "@/components/layout/PlayerBar";
import YouTubePlayerContainer from "@/components/music/YouTubePlayerContainer";
import { YouTubePlayerProvider } from "@/lib/contexts/YouTubePlayerContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${montserrat.variable}`}>
        <YouTubePlayerProvider>
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
