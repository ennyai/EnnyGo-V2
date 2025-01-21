-- Add strava_athlete_id column to strava_tokens table
ALTER TABLE strava_tokens
ADD COLUMN strava_athlete_id TEXT;

-- Create unique index on strava_athlete_id
CREATE UNIQUE INDEX idx_strava_tokens_athlete_id ON strava_tokens(strava_athlete_id);

-- Add comment explaining the column
COMMENT ON COLUMN strava_tokens.strava_athlete_id IS 'The Strava athlete ID associated with these tokens'; 