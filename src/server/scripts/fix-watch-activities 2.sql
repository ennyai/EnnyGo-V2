-- Update all existing user settings to have watch_activities set to false
UPDATE user_settings
SET watch_activities = false
WHERE watch_activities = true;

-- Verify the changes
SELECT user_id, watch_activities
FROM user_settings
ORDER BY created_at DESC; 