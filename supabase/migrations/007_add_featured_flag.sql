-- =============================================
-- Add Featured Flag to Posts
-- =============================================
-- This migration adds a featured flag to the posts table to support
-- highlighting featured posts in the activity timeline.
--
-- Changes:
--   - Add featured field (BOOLEAN, default false)
--   - Add index for featured field
-- =============================================

-- =============================================
-- ADD COLUMN
-- =============================================

-- Add featured field to mark posts as featured
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN posts.featured IS 'Whether this post should be featured/starred in the activity timeline';

-- =============================================
-- INDEXES
-- =============================================

-- Add index for featured field to support filtering featured posts
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);

-- =============================================
-- COMPLETION
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Featured flag migration completed successfully!';
  RAISE NOTICE 'Added column: featured (default: false)';
END $$;
