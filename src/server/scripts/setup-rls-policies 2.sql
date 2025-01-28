-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own tokens" ON strava_tokens;
DROP POLICY IF EXISTS "Users can view their own tokens" ON strava_tokens;
DROP POLICY IF EXISTS "Users can manage their own settings" ON user_settings;

-- Enable RLS on strava_tokens table
ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert/update their own tokens
CREATE POLICY "Users can manage their own tokens"
ON strava_tokens
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to read their own tokens
CREATE POLICY "Users can view their own tokens"
ON strava_tokens
FOR SELECT
USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT ALL ON strava_tokens TO authenticated;

-- Do the same for user_settings table
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own settings"
ON user_settings
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

GRANT ALL ON user_settings TO authenticated; 