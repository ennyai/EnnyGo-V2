const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const StravaService = require('../services/strava');

// Initialize Supabase client with service role key for backend access
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Use service role key instead of anon key
);

// Webhook verification endpoint
router.get('/webhook', (req, res) => {
  console.log('Received webhook verification request:', req.query);

  // Always check for challenge first
  const challenge = req.query['hub.challenge'];
  
  // If there's a challenge, this is a verification request
  if (challenge) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const VERIFY_TOKEN = process.env.STRAVA_VERIFY_TOKEN;

    console.log('Verifying webhook:', {
      mode,
      receivedToken: token,
      expectedToken: VERIFY_TOKEN,
      challenge
    });

    // Verify the mode and token
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED - Responding with challenge');
      return res.json({ "hub.challenge": challenge });
    }
    
    console.log('Webhook verification failed: Invalid token or mode');
    return res.sendStatus(403);
  }

  // If no challenge, just return 200 OK for other GET requests
  return res.sendStatus(200);
});

// Webhook event handler
router.post('/webhook', async (req, res) => {
  console.log('Received webhook event:', {
    headers: req.headers,
    body: req.body,
    method: req.method,
    path: req.path
  });
  
  const event = req.body;
  
  // Acknowledge receipt of the event immediately
  res.status(200).send('EVENT_RECEIVED');
  
  try {
    console.log('Processing webhook event:', {
      aspect_type: event.aspect_type,
      object_type: event.object_type,
      object_id: event.object_id,
      owner_id: event.owner_id
    });

    // Only process 'create' events for activities
    if (event.aspect_type === 'create' && event.object_type === 'activity') {
      console.log('Processing activity creation event:', event);
      
      // First get the tokens for this Strava athlete
      const stravaAthleteId = event.owner_id.toString();
      console.log('Fetching tokens for Strava athlete ID:', stravaAthleteId);
      
      // Debug: Log all tokens first
      const { data: allTokens, error: listError } = await supabase
        .from('strava_tokens')
        .select('*');
      
      console.log('All tokens in database:', allTokens);
      console.log('Looking for athlete ID:', stravaAthleteId);
      
      // Now try to get the specific token
      const { data: tokens, error: tokenError } = await supabase
        .from('strava_tokens')
        .select('*')
        .eq('strava_athlete_id', stravaAthleteId);

      if (tokenError) {
        console.error('Error fetching tokens:', tokenError);
        return;
      }

      if (!tokens || tokens.length === 0) {
        console.error('No tokens found for Strava athlete ID:', stravaAthleteId);
        return;
      }

      const token = tokens[0]; // Use the first token if multiple exist
      console.log('Found token for user:', token.user_id);

      // Get user settings
      console.log('Fetching user settings for user:', token.user_id);
      const { data: userSettings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', token.user_id);

      if (settingsError) {
        console.error('Error fetching user settings:', settingsError);
        return;
      }

      if (!userSettings || userSettings.length === 0) {
        console.error('No settings found for user:', token.user_id);
        return;
      }

      const settings = userSettings[0]; // Use the first settings if multiple exist
      console.log('Found user settings:', settings);

      const watchActivities = settings?.watch_activities ?? false;
      console.log('Activity watching status:', watchActivities);

      if (watchActivities) {
        console.log('Activity watching is enabled, processing activity...');
        
        // Get the full activity details from Strava
        console.log('Fetching activity details from Strava:', event.object_id);
        const activity = await StravaService.getActivity(event.object_id, token.access_token);
        console.log('Received activity details:', activity);
        
        // Generate a creative title
        const newTitle = StravaService.generateCreativeTitle(activity);
        console.log('Generated new title:', newTitle);
        
        // Update the activity title on Strava
        console.log('Updating activity title on Strava...');
        await StravaService.updateActivityTitle(event.object_id, newTitle, token.access_token);
        
        // Save activity to Supabase
        console.log('Saving activity to Supabase...');
        const { error: saveError } = await supabase
          .from('activities')
          .insert({
            strava_id: activity.id,
            user_id: token.user_id,
            name: newTitle,
            type: activity.type,
            distance: activity.distance,
            moving_time: activity.moving_time,
            start_date: activity.start_date,
            start_latlng: activity.start_latlng,
            end_latlng: activity.end_latlng,
            average_speed: activity.average_speed,
            max_speed: activity.max_speed,
            total_elevation_gain: activity.total_elevation_gain
          });

        if (saveError) {
          console.error('Error saving activity to Supabase:', saveError);
          return;
        }

        console.log(`Successfully updated activity ${event.object_id} title to: ${newTitle}`);
      } else {
        console.log('Activity watching is disabled for user:', token.user_id);
      }
    } else {
      console.log('Ignoring non-create or non-activity event:', event);
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    console.error('Error stack:', error.stack);
  }
});

// Create activity endpoint
router.post('/activities', async (req, res) => {
  try {
    const { data: tokens, error: tokenError } = await supabase
      .from('strava_tokens')
      .select('access_token, user_id')
      .eq('user_id', req.body.user_id)
      .single();

    if (tokenError) {
      console.error('Error fetching tokens:', tokenError);
      return res.status(401).json({ error: 'Unable to fetch user tokens' });
    }

    const activity = await StravaService.createActivity(tokens.access_token, {
      name: req.body.name || 'My Activity',
      type: req.body.type || 'Run',
      start_date_local: req.body.start_date_local || new Date().toISOString(),
      elapsed_time: req.body.elapsed_time || 3600, // 1 hour in seconds
      description: req.body.description || 'Activity created via EnnyGo',
      distance: req.body.distance || 10000, // 10km in meters
      trainer: req.body.trainer || 0,
      commute: req.body.commute || 0
    });

    res.json({ message: 'Activity created successfully', activity });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 