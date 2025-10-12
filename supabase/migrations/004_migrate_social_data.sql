-- =============================================
-- Migrate existing social link data
-- =============================================
-- This migration copies data from the old keys/category to the new ones
-- Old: instagram_music, facebook_music, tiktok_music in 'socials' category
-- New: instagram_handle, facebook_url, tiktok_url in 'music_social' category

-- Migrate Instagram data
INSERT INTO site_config (key, value, category)
SELECT 'instagram_handle', value, 'music_social'
FROM site_config
WHERE key = 'instagram_music' AND value != ''
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Migrate Facebook data
INSERT INTO site_config (key, value, category)
SELECT 'facebook_url', value, 'music_social'
FROM site_config
WHERE key = 'facebook_music' AND value != ''
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Migrate TikTok data
INSERT INTO site_config (key, value, category)
SELECT 'tiktok_url', value, 'music_social'
FROM site_config
WHERE key = 'tiktok_music' AND value != ''
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Update patreon_url category if it exists in 'socials'
UPDATE site_config
SET category = 'music_social'
WHERE key = 'patreon_url' AND category = 'socials';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Social data migration completed successfully!';
  RAISE NOTICE 'Migrated instagram_music -> instagram_handle';
  RAISE NOTICE 'Migrated facebook_music -> facebook_url';
  RAISE NOTICE 'Migrated tiktok_music -> tiktok_url';
  RAISE NOTICE 'Updated patreon_url category to music_social';
END $$;
