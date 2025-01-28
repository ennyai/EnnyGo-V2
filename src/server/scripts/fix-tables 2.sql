-- First, let's check if tables exist
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'strava_tokens'
) as strava_tokens_exists;

SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'user_settings'
) as user_settings_exists;

-- Create strava_tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS strava_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  strava_athlete_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(strava_athlete_id)
);

-- Create user_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  watch_activities BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for strava_tokens
DROP POLICY IF EXISTS "Users can view their own tokens" ON strava_tokens;
DROP POLICY IF EXISTS "Users can manage their own tokens" ON strava_tokens;

CREATE POLICY "Users can view their own tokens"
  ON strava_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tokens"
  ON strava_tokens
  FOR ALL
  USING (auth.uid() = user_id);

-- Create policies for user_settings
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can manage their own settings" ON user_settings;

CREATE POLICY "Users can view their own settings"
  ON user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own settings"
  ON user_settings
  FOR ALL
  USING (auth.uid() = user_id); 