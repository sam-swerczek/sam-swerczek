-- =============================================
-- Add missing social link configurations
-- =============================================
-- This migration adds TikTok and LinkedIn URLs to the music_social category
-- for the SocialLinks component on the music page.

-- Add TikTok URL if it doesn't exist
INSERT INTO site_config (key, value, category)
VALUES ('tiktok_url', '', 'music_social')
ON CONFLICT (key) DO NOTHING;

-- Add LinkedIn URL to music_social if it doesn't exist
INSERT INTO site_config (key, value, category)
VALUES ('linkedin_music', '', 'music_social')
ON CONFLICT (key) DO NOTHING;

-- Add Twitter/X URL if it doesn't exist
INSERT INTO site_config (key, value, category)
VALUES ('twitter_url', '', 'music_social')
ON CONFLICT (key) DO NOTHING;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Social links migration completed successfully!';
  RAISE NOTICE 'Added tiktok_url, linkedin_music, and twitter_url to music_social category';
END $$;
