import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import AboutMe from "@/components/home/AboutMe";
import MusicSection from "@/components/home/MusicSection";
import EngineeringSection from "@/components/home/EngineeringSection";
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

      {/* About Me - Quick introduction with skills */}
      <AboutMe />

      {/* Music - Songwriting philosophy and play button */}
      <MusicSection musicImageUrl={data.musicImageUrl} />

      {/* Engineering - Site development and GitHub link */}
      <EngineeringSection engineeringImageUrl={data.engineeringImageUrl} githubUrl={data.githubUrl} />

      {/* Activity Timeline - Recent releases and blog posts */}
      <ActivityTimeline blogPosts={data.blogPosts} commentCounts={data.commentCounts} />

      {/* Connect Section - Contact call to action */}
      <ConnectSection contactImageUrl={data.contactImageUrl} />
    </>
  );
}
