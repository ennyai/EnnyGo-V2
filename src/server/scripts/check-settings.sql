-- Check user settings
SELECT us.*, st.strava_athlete_id
FROM user_settings us
JOIN strava_tokens st ON us.user_id = st.user_id;

-- Check if watch_activities is enabled
SELECT us.watch_activities, st.strava_athlete_id
FROM user_settings us
JOIN strava_tokens st ON us.user_id = st.user_id
WHERE st.strava_athlete_id = '150686135';  -- Your Strava athlete ID

-- Show all tokens for reference
SELECT * FROM strava_tokens; 