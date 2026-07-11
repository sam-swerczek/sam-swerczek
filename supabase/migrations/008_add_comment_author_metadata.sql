-- =============================================
-- Comment Author Metadata
-- =============================================
-- Adds denormalized author display fields to comments so the public
-- comment list can show real names and avatars for every commenter.
--
-- The comments table only stores author_id (a reference to auth.users),
-- and auth.users is not readable via the public anon key. Rather than
-- expose a profiles table, we snapshot the author's display name and
-- avatar (from their OAuth provider / user_metadata) onto each comment
-- at creation time. These are captured server-side in the POST /api/comments
-- route from the authenticated user, so they cannot be spoofed by clients.
-- =============================================

ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;

COMMENT ON COLUMN comments.author_name IS 'Display name snapshot from the author''s auth provider at comment time';
COMMENT ON COLUMN comments.author_avatar_url IS 'Avatar URL snapshot from the author''s auth provider at comment time';
