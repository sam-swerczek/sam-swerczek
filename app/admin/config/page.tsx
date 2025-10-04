import { getAllSiteConfig } from '@/lib/supabase/admin';
import SiteConfigClient from './SiteConfigClient';
import type { SiteConfig } from '@/lib/types';

export default async function SiteConfigPage() {
  let siteConfig: SiteConfig[] = [];

  try {
    siteConfig = await getAllSiteConfig();
  } catch (error) {
    console.error('Error loading site config:', error);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Site Configuration</h1>
        <p className="text-text-secondary">Manage social media links and site settings</p>
      </div>

      <SiteConfigClient initialConfig={siteConfig} />
    </div>
  );
}
