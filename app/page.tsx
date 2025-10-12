import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import FeaturedWorksShowcase from "@/components/home/FeaturedWorksShowcase";
import ActivityTimeline from "@/components/home/ActivityTimeline";
import SocialLinks from "@/components/music/SocialLinks";
import { getSiteConfig } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Sam Swerczek | Singer-Songwriter & Software Engineer",
  description: "Personal website of Sam Swerczek - singer-songwriter and software engineer. Explore original music, live performances, and engineering insights.",
};

export default async function Home() {
  // Fetch social media config
  const socialsConfig = await getSiteConfig('music_social');

  const instagramUrl = socialsConfig.find(c => c.key === 'instagram_handle')?.value;
  const facebookUrl = socialsConfig.find(c => c.key === 'facebook_url')?.value;
  const linkedinUrl = socialsConfig.find(c => c.key === 'linkedin_music')?.value;
  const tiktokUrl = socialsConfig.find(c => c.key === 'tiktok_url')?.value;
  const patreonUrl = socialsConfig.find(c => c.key === 'patreon_url')?.value;

  return (
    <>
      {/* Hero Section - Identity and immediate navigation */}
      <HeroSection />

      {/* Featured Works - Proof of credibility (music + tech) */}
      <FeaturedWorksShowcase />

      {/* Activity Timeline - Recent releases and blog posts */}
      <ActivityTimeline />

      {/* Social Media Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
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
              layout="horizontal"
            />
          </div>
        </div>
      </section>
    </>
  );
}
