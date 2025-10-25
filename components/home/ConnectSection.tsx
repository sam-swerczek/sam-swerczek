import SocialLinks from "@/components/music/SocialLinks";
import SectionHeader from "@/components/ui/SectionHeader";
import { MusicSocialConfig } from "@/lib/supabase/config-helpers";

interface ConnectSectionProps {
  social: MusicSocialConfig;
}

export default function ConnectSection({ social }: ConnectSectionProps) {
  return (
    <section className="relative py-12 md:py-16 bg-background-primary overflow-hidden">
      {/* Background gradient matching hero section bottom - navy left to orange right */}
      <div className="absolute inset-0 bg-gradient-to-r from-background-navy via-[rgb(21,23,25)] to-background-primary/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent-gold/8" />

      <div className="relative z-10 container mx-auto px-4">
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
      </div>
    </section>
  );
}
