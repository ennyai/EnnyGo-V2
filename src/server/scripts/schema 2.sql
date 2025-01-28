-- Add strava_athlete_id to strava_tokens
ALTER TABLE public.strava_tokens
ADD COLUMN IF NOT EXISTS strava_athlete_id TEXT UNIQUE;

-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    watch_activities BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Create RLS policies for user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
    ON public.user_settings
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON public.user_settings
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create index on strava_athlete_id
CREATE INDEX IF NOT EXISTS idx_strava_tokens_athlete_id ON public.strava_tokens(strava_athlete_id); 