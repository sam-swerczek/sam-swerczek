import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';
import { getConfigObject, type MusicSocialConfig, type EngineeringSocialConfig, type GeneralConfig } from '@/lib/supabase/config-helpers';

export const metadata: Metadata = {
  title: 'Contact | Sam Swerczek',
  description: 'Get in touch with Sam Swerczek for collaborations, bookings, or just to say hello.',
};

export default async function ContactPage() {
  // Fetch social config data for multiple platforms
  const [musicSocial, engineeringSocial, general] = await Promise.all([
    getConfigObject<MusicSocialConfig>('music_social'),
    getConfigObject<EngineeringSocialConfig>('engineering_social'),
    getConfigObject<GeneralConfig>('general'),
  ]);

  return (
    <ContactPageClient
      profileImageUrl={general.profile_image_url}
      contactImageUrl={general.contact_image_url}
      bookingEmail={general.booking_email}
      instagramUrl={musicSocial.instagram_handle}
      facebookUrl={musicSocial.facebook_url}
      linkedinUrl={musicSocial.linkedin_music || engineeringSocial.linkedin_url}
      tiktokUrl={musicSocial.tiktok_url}
      patreonUrl={musicSocial.patreon_url}
    />
  );
}
