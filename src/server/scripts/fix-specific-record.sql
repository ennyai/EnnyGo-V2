-- Update the specific record
UPDATE user_settings
SET watch_activities = false
WHERE user_id = '22aefcb9-d2ad-40a2-8cf1-d1f0733d16d3';

-- Verify the change
SELECT user_id, watch_activities, created_at, updated_at
FROM user_settings
WHERE user_id = '22aefcb9-d2ad-40a2-8cf1-d1f0733d16d3'; 