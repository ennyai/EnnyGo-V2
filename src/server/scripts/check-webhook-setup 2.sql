-- Check user settings
SELECT us.user_id, us.watch_activities, st.strava_athlete_id
FROM user_settings us
LEFT JOIN strava_tokens st ON us.user_id = st.user_id;

-- Check strava tokens
SELECT user_id, strava_athlete_id, 
       CASE 
         WHEN access_token IS NOT NULL THEN 'present'
         ELSE 'missing'
       END as token_status,
       expires_at
FROM strava_tokens; 