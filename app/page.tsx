import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedBlog from "@/components/home/FeaturedBlog";
import NavigationSection from "@/components/home/NavigationSection";

export const metadata: Metadata = {
  title: "Sam Swerczek | Singer-Songwriter & Software Engineer",
  description: "Personal website of Sam Swerczek - singer-songwriter and software engineer. Explore original music, live performances, and engineering insights.",
};

export default function Home() {
  return (
    <>
      {/* Hero Section - Quick navigation to Music or Blog */}
      <HeroSection />

      {/* About Section - Learn about Sam */}
      <AboutSection />

      {/* Featured Blog - Latest article */}
      <FeaturedBlog />

      {/* Navigation Section - Explore Music or Engineering */}
      <NavigationSection />
    </>
  );
}
