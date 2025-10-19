import { getAllSongs } from '@/lib/supabase/mutations';
import SongsAdminClient from './SongsAdminClient';
import type { Song } from '@/lib/types';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export default async function SongsAdminPage() {
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
  let songs: Song[] = [];
  let error: string | null = null;

  try {
    songs = await getAllSongs();
  } catch (err) {
    console.error('Error loading songs:', err);
    error = err instanceof Error ? err.message : 'Failed to load songs';
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Songs Management</h1>
        <p className="text-text-secondary">
          Add, edit, and manage music tracks for the YouTube player system
        </p>
      </div>

      {error ? (
        <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg p-4">
          <p className="font-medium">Error loading songs</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <SongsAdminClient initialSongs={songs} />
      )}
    </div>
  );
}
