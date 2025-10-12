-- =============================================
-- SONGS TABLE MIGRATION
-- =============================================
-- This migration creates the songs table for managing music tracks
-- with YouTube integration and content type classification.

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Song metadata
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT 'Sam Swerczek',

  -- YouTube integration
  youtube_video_id TEXT NOT NULL UNIQUE,

  -- Content type: 'audio' for audio-only tracks (show artwork), 'video' for video tracks (show video player)
  content_type TEXT NOT NULL CHECK (content_type IN ('audio', 'video')),

  -- Display settings
  album_cover_url TEXT,

  -- Organization
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Metadata
  duration_seconds INTEGER,
  release_date DATE,
  description TEXT,
  tags TEXT[] DEFAULT '{}',

  -- External links (streaming platforms)
  spotify_url TEXT,
  apple_music_url TEXT,

  -- Ensure YouTube video ID follows correct format (11 characters)
  CONSTRAINT youtube_video_id_format CHECK (youtube_video_id ~ '^[a-zA-Z0-9_-]{11}$')
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_songs_display_order ON songs(display_order);
CREATE INDEX IF NOT EXISTS idx_songs_is_featured ON songs(is_featured);
CREATE INDEX IF NOT EXISTS idx_songs_is_active ON songs(is_active);
CREATE INDEX IF NOT EXISTS idx_songs_content_type ON songs(content_type);

-- Add table and column comments
COMMENT ON TABLE songs IS 'Music tracks with YouTube integration and content type classification';
COMMENT ON COLUMN songs.content_type IS 'Track type: "audio" (show artwork) or "video" (show video player)';
COMMENT ON COLUMN songs.youtube_video_id IS '11-character YouTube video ID';
COMMENT ON COLUMN songs.is_featured IS 'Whether this track should be prominently displayed (only one should be featured at a time)';
COMMENT ON COLUMN songs.album_cover_url IS 'URL to album cover image. For videos, can use YouTube thumbnail or custom image';
COMMENT ON COLUMN songs.display_order IS 'Order in which songs appear in the playlist (lower numbers first)';

-- Create or replace function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on row updates
DROP TRIGGER IF EXISTS update_songs_updated_at ON songs;
CREATE TRIGGER update_songs_updated_at
  BEFORE UPDATE ON songs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Public can view active songs
CREATE POLICY "Public can view active songs"
  ON songs FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can manage all songs
CREATE POLICY "Authenticated users can manage songs"
  ON songs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial sample data (Auburn Maine)
INSERT INTO songs (
  title,
  artist,
  youtube_video_id,
  content_type,
  is_featured,
  display_order,
  description,
  tags
) VALUES (
  'Auburn Maine',
  'Sam Swerczek',
  'Qey4qv3KnYI',
  'audio',
  true,
  1,
  'Latest single exploring themes of nostalgia and home',
  ARRAY['Singer-Songwriter', 'Acoustic', 'Indie Folk']
)
ON CONFLICT (youtube_video_id) DO NOTHING;
