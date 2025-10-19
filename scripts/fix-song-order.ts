/**
 * Script to fix song ordering in the database
 * Run with: npx tsx scripts/fix-song-order.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Song {
  id: string;
  title: string;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
}

async function fixSongOrder() {
  console.log('🎵 Fixing song order...\n');

  // Fetch all songs
  const { data: songs, error } = await supabase
    .from('songs')
    .select('id, title, display_order, is_active, is_featured')
    .order('title', { ascending: true });

  if (error) {
    console.error('❌ Error fetching songs:', error);
    return;
  }

  if (!songs || songs.length === 0) {
    console.log('No songs found');
    return;
  }

  console.log('Current songs:');
  songs.forEach((s) => {
    console.log(`  - ${s.title}: order=${s.display_order}, active=${s.is_active}, featured=${s.is_featured}`);
  });

  console.log('\n📋 Setting correct order...\n');

  // Define the desired order
  const desiredOrder = [
    { title: 'Holding Back', order: 1, featured: true, active: true },
    { title: 'What If', order: 2, featured: false, active: true },
    { title: 'Auburn, Maine', order: 3, featured: false, active: true },
    { title: 'Meant to Say', order: 4, featured: false, active: true },
    { title: 'Creep', order: 5, featured: false, active: false },
  ];

  // Update each song
  for (const desired of desiredOrder) {
    const song = songs.find((s) =>
      s.title.toLowerCase().includes(desired.title.toLowerCase()) ||
      desired.title.toLowerCase().includes(s.title.toLowerCase())
    );

    if (!song) {
      console.log(`⚠️  Song not found: ${desired.title}`);
      continue;
    }

    console.log(`Updating "${song.title}":`);
    console.log(`  - display_order: ${song.display_order} → ${desired.order}`);
    console.log(`  - is_featured: ${song.is_featured} → ${desired.featured}`);
    console.log(`  - is_active: ${song.is_active} → ${desired.active}`);

    const { error: updateError } = await supabase
      .from('songs')
      .update({
        display_order: desired.order,
        is_featured: desired.featured,
        is_active: desired.active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', song.id);

    if (updateError) {
      console.error(`  ❌ Error updating ${song.title}:`, updateError);
    } else {
      console.log(`  ✅ Updated successfully\n`);
    }
  }

  // Verify the changes
  console.log('\n🔍 Verifying changes...\n');
  const { data: updatedSongs } = await supabase
    .from('songs')
    .select('id, title, display_order, is_active, is_featured')
    .order('display_order', { ascending: true });

  if (updatedSongs) {
    console.log('Final song order:');
    updatedSongs.forEach((s, i) => {
      const status = [];
      if (s.is_featured) status.push('FEATURED');
      if (!s.is_active) status.push('INACTIVE');
      const statusStr = status.length > 0 ? ` [${status.join(', ')}]` : '';
      console.log(`  ${i + 1}. ${s.title}: order=${s.display_order}${statusStr}`);
    });
  }

  console.log('\n✨ Done!');
}

fixSongOrder().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
