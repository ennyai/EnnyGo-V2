-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    watch_activities BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create strava_tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS strava_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at INT8 NOT NULL,
    strava_athlete_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(strava_athlete_id)
);

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

-- Enable RLS on user_settings table
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to manage their own settings
CREATE POLICY "Users can manage their own settings"
ON user_settings
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT ALL ON user_settings TO authenticated;

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to both tables
DROP TRIGGER IF EXISTS update_strava_tokens_updated_at ON strava_tokens;
CREATE TRIGGER update_strava_tokens_updated_at
    BEFORE UPDATE ON strava_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 