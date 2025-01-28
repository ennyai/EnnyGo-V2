-- Check all tokens
SELECT user_id, strava_athlete_id, 
       CASE 
         WHEN access_token IS NOT NULL THEN 'present'
         ELSE 'missing'
       END as token_status,
       created_at,
       updated_at
FROM strava_tokens;

-- Check if the specific athlete ID exists
SELECT * FROM strava_tokens 
WHERE strava_athlete_id = '150686135'; 