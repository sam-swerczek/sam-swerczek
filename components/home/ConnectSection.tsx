import SocialLinks from "@/components/music/SocialLinks";
import SectionHeader from "@/components/ui/SectionHeader";
import { MusicSocialConfig } from "@/lib/supabase/config-helpers";

interface ConnectSectionProps {
  social: MusicSocialConfig;
}

export default function ConnectSection({ social }: ConnectSectionProps) {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto text-center">
        <SectionHeader
          title="Connect With Me"
          subtitle="Follow for updates, new releases, and upcoming shows"
        />
        <div className="bg-background-secondary/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-text-secondary/10">
          <SocialLinks
            instagramUrl={social.instagram_handle}
            facebookUrl={social.facebook_url}
            linkedinUrl={social.linkedin_music}
            tiktokUrl={social.tiktok_url}
            patreonUrl={social.patreon_url}
            layout="horizontal"
          />
        </div>
      </div>
    </section>
  );
}
