-- Clear all data from tables
TRUNCATE TABLE activities CASCADE;
TRUNCATE TABLE strava_tokens CASCADE;
TRUNCATE TABLE user_settings CASCADE;

-- Reset sequences
ALTER SEQUENCE activities_id_seq RESTART WITH 1;
ALTER SEQUENCE strava_tokens_id_seq RESTART WITH 1;
ALTER SEQUENCE user_settings_id_seq RESTART WITH 1; 