import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import FeaturedWorksShowcase from "@/components/home/FeaturedWorksShowcase";
import ActivityTimeline from "@/components/home/ActivityTimeline";
import ConnectSection from "@/components/home/ConnectSection";
import { getHomepageData } from "@/lib/data/homepage";

export const metadata: Metadata = {
  title: "Sam Swerczek | Singer-Songwriter & Software Engineer",
  description: "Personal website of Sam Swerczek - singer-songwriter and software engineer. Explore original music, live performances, and engineering insights.",
};

export default async function Home() {
  // Fetch all data in parallel for optimal performance
  const data = await getHomepageData();

  return (
    <>
      {/* Hero Section - Identity and immediate navigation */}
      <HeroSection heroImageUrl={data.heroImageUrl} />

      {/* Featured Works - Proof of credibility (music + tech) */}
      <FeaturedWorksShowcase
        featuredSong={data.featuredSong}
        githubUrl={data.githubUrl}
      />

      {/* Activity Timeline - Recent releases and blog posts */}
      <ActivityTimeline blogPosts={data.blogPosts} commentCounts={data.commentCounts} />

      {/* Connect Section - Social media links */}
      <ConnectSection social={data.social} />
    </>
  );
}
