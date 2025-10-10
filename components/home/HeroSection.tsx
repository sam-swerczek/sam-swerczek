import Button from '@/components/ui/Button';
import { getSiteConfig } from '@/lib/supabase/queries';
import HeroClient from './HeroClient';

export default async function HeroSection() {
  const siteConfig = await getSiteConfig();
  const heroImageUrl = siteConfig.find(c => c.key === 'hero_image_url')?.value;

  return <HeroClient heroImageUrl={heroImageUrl} />;
}
