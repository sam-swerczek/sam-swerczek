-- =============================================
-- Sam Swerczek Personal Website - Initial Schema
-- =============================================
-- This migration creates the initial database schema for the personal website
-- including blog posts, site configuration, and media management.
--
-- Tables:
--   - posts: Blog posts with rich content
--   - site_config: Site-wide configuration (social links, settings, etc.)
--   - media: Uploaded media files (images, etc.)
--
-- Security: Row Level Security (RLS) is enabled on all tables
-- =============================================

-- =============================================
-- EXTENSIONS
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- POSTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS posts (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Content fields
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,

  -- Publishing
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,

  -- Author (foreign key to auth.users)
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  featured_image_url TEXT,
  meta_description TEXT,

  -- Constraints
  CONSTRAINT slug_lowercase CHECK (slug = lower(slug)),
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);

-- Add comments
COMMENT ON TABLE posts IS 'Blog posts with rich content, tags, and publishing workflow';
COMMENT ON COLUMN posts.slug IS 'URL-friendly unique identifier (lowercase, hyphen-separated)';
COMMENT ON COLUMN posts.content IS 'Full post content (Markdown format)';
COMMENT ON COLUMN posts.excerpt IS 'Short summary for post listings';
COMMENT ON COLUMN posts.published IS 'Whether the post is publicly visible';
COMMENT ON COLUMN posts.tags IS 'Array of tags for categorization and filtering';

-- =============================================
-- SITE_CONFIG TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS site_config (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Configuration key-value
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  category TEXT NOT NULL,

  -- Timestamp
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT key_lowercase CHECK (key = lower(key)),
  CONSTRAINT key_format CHECK (key ~ '^[a-z0-9_]+$')
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_site_config_key ON site_config(key);
CREATE INDEX IF NOT EXISTS idx_site_config_category ON site_config(category);

-- Add comments
COMMENT ON TABLE site_config IS 'Site-wide configuration settings (social links, feature flags, etc.)';
COMMENT ON COLUMN site_config.key IS 'Unique configuration key (lowercase, underscore-separated)';
COMMENT ON COLUMN site_config.value IS 'Configuration value (stored as text, parse as needed)';
COMMENT ON COLUMN site_config.category IS 'Configuration category (e.g., "music_social", "engineering_social", "features")';

-- Insert default configuration values
INSERT INTO site_config (key, value, category) VALUES
  -- Music social links
  ('spotify_url', '', 'music_social'),
  ('instagram_handle', '', 'music_social'),
  ('facebook_url', '', 'music_social'),
  ('youtube_url', '', 'music_social'),
  ('patreon_url', '', 'music_social'),

  -- Engineering social links
  ('github_url', '', 'engineering_social'),
  ('linkedin_url', '', 'engineering_social'),

  -- Site settings
  ('site_title', 'Sam Swerczek', 'general'),
  ('site_description', 'Singer-songwriter and software engineer', 'general'),
  ('blog_posts_per_page', '10', 'blog')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- MEDIA TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS media (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- File information
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,

  -- Metadata
  alt_text TEXT,
  caption TEXT,

  -- Uploader (foreign key to auth.users)
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Constraints
  CONSTRAINT positive_size CHECK (size_bytes > 0)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

-- Add comments
COMMENT ON TABLE media IS 'Uploaded media files (images, documents, etc.)';
COMMENT ON COLUMN media.storage_path IS 'Path in Supabase Storage bucket';
COMMENT ON COLUMN media.url IS 'Public URL to access the file';
COMMENT ON COLUMN media.alt_text IS 'Alternative text for accessibility';

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - POSTS
-- =============================================

-- Public: Read access to published posts
CREATE POLICY "Public can view published posts"
  ON posts
  FOR SELECT
  TO public
  USING (published = true);

-- Authenticated: Read all posts (including drafts)
CREATE POLICY "Authenticated users can view all posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated: Insert posts
CREATE POLICY "Authenticated users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated: Update posts
CREATE POLICY "Authenticated users can update posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated: Delete posts
CREATE POLICY "Authenticated users can delete posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- RLS POLICIES - SITE_CONFIG
-- =============================================

-- Public: Read all site config
CREATE POLICY "Public can view site config"
  ON site_config
  FOR SELECT
  TO public
  USING (true);

-- Authenticated: Insert config
CREATE POLICY "Authenticated users can create config"
  ON site_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated: Update config
CREATE POLICY "Authenticated users can update config"
  ON site_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated: Delete config
CREATE POLICY "Authenticated users can delete config"
  ON site_config
  FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- RLS POLICIES - MEDIA
-- =============================================

-- Public: Read all media
CREATE POLICY "Public can view media"
  ON media
  FOR SELECT
  TO public
  USING (true);

-- Authenticated: Insert media
CREATE POLICY "Authenticated users can upload media"
  ON media
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated: Update media (only their own)
CREATE POLICY "Authenticated users can update their own media"
  ON media
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

-- Authenticated: Delete media (only their own)
CREATE POLICY "Authenticated users can delete their own media"
  ON media
  FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Set published_at when published changes from false to true
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  -- If published changed from false to true, set published_at
  IF NEW.published = true AND (OLD.published = false OR OLD.published IS NULL) THEN
    NEW.published_at = NOW();
  END IF;

  -- If published changed from true to false, clear published_at
  IF NEW.published = false AND OLD.published = true THEN
    NEW.published_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Generate slug from title
CREATE OR REPLACE FUNCTION slugify(text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(text, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger: Update updated_at on posts
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update updated_at on site_config
CREATE TRIGGER update_site_config_updated_at
  BEFORE UPDATE ON site_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Set published_at on posts
CREATE TRIGGER set_posts_published_at
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();

-- =============================================
-- GRANTS
-- =============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant access to tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant access to sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================
-- VIEWS (OPTIONAL)
-- =============================================

-- View: Published posts with author info
CREATE OR REPLACE VIEW published_posts AS
SELECT
  p.id,
  p.created_at,
  p.updated_at,
  p.title,
  p.slug,
  p.content,
  p.excerpt,
  p.published,
  p.published_at,
  p.author_id,
  p.tags,
  p.featured_image_url,
  p.meta_description,
  u.email as author_email
FROM posts p
LEFT JOIN auth.users u ON p.author_id = u.id
WHERE p.published = true
ORDER BY p.published_at DESC;

-- Grant access to view
GRANT SELECT ON published_posts TO anon, authenticated;

-- =============================================
-- COMPLETION
-- =============================================

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Initial schema migration completed successfully!';
  RAISE NOTICE 'Tables created: posts, site_config, media';
  RAISE NOTICE 'RLS policies enabled and configured';
  RAISE NOTICE 'Triggers and functions created';
END $$;
