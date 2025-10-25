import { getAllSiteConfig } from '@/lib/supabase/admin';
import VideosAdminClient from './VideosAdminClient';
import type { SiteConfig } from '@/lib/types';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function VideosAdminPage() {
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

  // Fetch site config filtered to featured_videos category
  let siteConfig: SiteConfig[] = [];

  try {
    const allConfig = await getAllSiteConfig();
    // Filter to only featured_videos category
    siteConfig = allConfig.filter(config => config.category === 'featured_videos');
  } catch (error) {
    console.error('Error loading site config:', error);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Manage Videos</h1>
        <p className="text-text-secondary">Manage featured YouTube videos displayed on your site</p>
      </div>

      <VideosAdminClient initialConfig={siteConfig} />
    </div>
  );
}
