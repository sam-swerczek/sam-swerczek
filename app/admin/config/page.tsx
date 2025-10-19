import { getAllSiteConfig } from '@/lib/supabase/admin';
import SiteConfigClient from './SiteConfigClient';
import type { SiteConfig } from '@/lib/types';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export default async function SiteConfigPage() {
  // Server-side authentication check
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle server component cookie limitations
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Now safe to fetch admin data
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
