-- =============================================
-- Add Blog Metadata Fields
-- =============================================
-- This migration adds metadata fields to the posts table to support
-- enhanced blog features including short titles and content types.
--
-- Changes:
--   - Add short_title field (TEXT, nullable)
--   - Add type field (TEXT, default 'blog post')
--   - Backfill short_title for existing posts
--   - Add index for type field
-- =============================================

-- =============================================
-- ADD COLUMNS
-- =============================================

-- Add short_title field for navigation and cards
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS short_title TEXT;

-- Add type field to distinguish content types
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'blog post';

-- Add comments for documentation
COMMENT ON COLUMN posts.short_title IS 'Shortened title for navigation/cards (auto-generated or manual, ~30 chars)';
COMMENT ON COLUMN posts.type IS 'Content type (e.g., "blog post", "tutorial", "case study")';

-- =============================================
-- BACKFILL EXISTING DATA
-- =============================================

-- Generate short_title for existing posts (truncate to 30 chars with '...')
UPDATE posts
SET short_title = CASE
  WHEN LENGTH(title) <= 30 THEN title
  ELSE SUBSTRING(title FROM 1 FOR 27) || '...'
END
WHERE short_title IS NULL;

-- =============================================
-- INDEXES
-- =============================================

-- Add index for type field to support filtering by content type
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);

-- =============================================
-- COMPLETION
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Blog metadata migration completed successfully!';
  RAISE NOTICE 'Added columns: short_title, type';
  RAISE NOTICE 'Backfilled short_title for % posts', (SELECT COUNT(*) FROM posts WHERE short_title IS NOT NULL);
END $$;
