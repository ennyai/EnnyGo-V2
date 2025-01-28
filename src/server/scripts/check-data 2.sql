-- Check strava_tokens table structure and data
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'strava_tokens';

-- Check current tokens
SELECT * FROM strava_tokens;

-- Check if user_settings table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_name = 'user_settings'
); 