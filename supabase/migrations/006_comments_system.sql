-- =============================================
-- Comments System
-- =============================================
-- This migration creates the comments system for blog posts with
-- proper RLS policies, triggers, and views for efficient queries.
--
-- Features:
--   - Comments table with author and post relationships
--   - RLS policies for secure access control
--   - Trigger for updated_at timestamp
--   - View for efficient comment counts
-- =============================================

-- =============================================
-- COMMENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS comments (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Relationships
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  content TEXT NOT NULL,

  -- Moderation
  is_visible BOOLEAN NOT NULL DEFAULT true,

  -- Constraints
  CONSTRAINT content_not_empty CHECK (LENGTH(TRIM(content)) > 0),
  CONSTRAINT content_max_length CHECK (LENGTH(content) <= 5000)
);

-- Add comments for documentation
COMMENT ON TABLE comments IS 'User comments on blog posts';
COMMENT ON COLUMN comments.content IS 'Comment content (plain text, max 5000 chars)';
COMMENT ON COLUMN comments.is_visible IS 'Moderation flag - false to hide comment from public';
COMMENT ON COLUMN comments.author_id IS 'User who wrote the comment';
COMMENT ON COLUMN comments.post_id IS 'Blog post being commented on';

-- =============================================
-- INDEXES
-- =============================================

-- Index for fetching comments by post (most common query)
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- Index for fetching comments by author
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);

-- Index for filtering visible comments
CREATE INDEX IF NOT EXISTS idx_comments_visible ON comments(is_visible);

-- Composite index for efficient post comment queries
CREATE INDEX IF NOT EXISTS idx_comments_post_visible ON comments(post_id, is_visible);

-- Index for ordering by creation date
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public: View visible comments
CREATE POLICY "Public can view visible comments"
  ON comments
  FOR SELECT
  TO public
  USING (is_visible = true);

-- Authenticated: View all comments (including hidden)
CREATE POLICY "Authenticated users can view all comments"
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated: Create comments (author_id must match auth.uid())
CREATE POLICY "Authenticated users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Users: Update their own comments
CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Users: Delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger: Update updated_at on comments
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VIEWS
-- =============================================

-- View: Post comment counts (for efficient batch queries)
CREATE OR REPLACE VIEW post_comment_counts AS
SELECT
  post_id,
  COUNT(*) as comment_count
FROM comments
WHERE is_visible = true
GROUP BY post_id;

-- Add comment for documentation
COMMENT ON VIEW post_comment_counts IS 'Aggregated comment counts per post (visible comments only)';

-- Grant access to view
GRANT SELECT ON post_comment_counts TO anon, authenticated;

-- =============================================
-- GRANTS
-- =============================================

-- Grant access to comments table
GRANT SELECT ON comments TO anon;
GRANT ALL ON comments TO authenticated, service_role;

-- =============================================
-- COMPLETION
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'Comments system migration completed successfully!';
  RAISE NOTICE 'Created table: comments';
  RAISE NOTICE 'Created view: post_comment_counts';
  RAISE NOTICE 'RLS policies enabled and configured';
  RAISE NOTICE 'Triggers configured for updated_at';
END $$;
