const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const StravaService = require('../services/strava');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test endpoint to simulate webhook event (only in development)
if (process.env.NODE_ENV === 'development') {
  router.post('/webhook/test', async (req, res) => {
    try {
      const testEvent = {
        aspect_type: 'create',
        object_type: 'activity',
        object_id: req.body.activity_id,
        owner_id: req.body.user_id,
        updates: {},
        subscription_id: 272117,
      };

      // Forward the test event to the webhook handler
      const webhookResponse = await new Promise((resolve) => {
        router.handle(
          {
            method: 'POST',
            url: '/webhook',
            body: testEvent,
            headers: {},
          },
          {
            status: (code) => ({
              send: (message) => resolve({ code, message }),
            }),
          }
        );
      });

      res.json({
        message: 'Test event processed',
        webhookResponse,
        testEvent,
      });
    } catch (error) {
      console.error('Error processing test event:', error);
      res.status(500).json({ error: error.message });
    }
  });
}

// Webhook verification endpoint
router.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.STRAVA_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.json({ "hub.challenge": challenge });
    } else {
      res.sendStatus(403);
    }
  }
});

// Webhook event handler
router.post('/webhook', async (req, res) => {
  const event = req.body;
  
  // Acknowledge receipt of the event immediately
  res.status(200).send('EVENT_RECEIVED');
  
  try {
    // Only process 'create' events for activities
    if (event.aspect_type === 'create' && event.object_type === 'activity') {
      console.log('Processing activity creation event:', event);
      
      // First get the tokens for this Strava athlete
      const { data: tokens, error: tokenError } = await supabase
        .from('strava_tokens')
        .select('access_token, user_id')
        .eq('strava_athlete_id', event.owner_id.toString())
        .single();

      if (tokenError) {
        console.error('Error fetching tokens:', tokenError);
        return;
      }

      if (!tokens) {
        console.error('No tokens found for Strava athlete ID:', event.owner_id);
        return;
      }

      // Get user settings
      const { data: userSettings, error: settingsError } = await supabase
        .from('user_settings')
        .select('watch_activities')
        .eq('user_id', tokens.user_id)
        .single();

      if (settingsError) {
        console.error('Error fetching user settings:', settingsError);
        return;
      }

      const watchActivities = userSettings?.watch_activities ?? false;

      if (watchActivities) {
        console.log('Activity watching is enabled, processing activity...');
        
        // Get the full activity details from Strava
        const activity = await StravaService.getActivity(event.object_id, tokens.access_token);
        
        // Generate a creative title
        const newTitle = StravaService.generateCreativeTitle(activity);
        console.log('Generated new title:', newTitle);
        
        // Update the activity title on Strava
        await StravaService.updateActivityTitle(event.object_id, newTitle, tokens.access_token);
        
        // Save activity to Supabase
        const { error: saveError } = await supabase
          .from('activities')
          .insert({
            strava_id: activity.id,
            user_id: tokens.user_id,
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
        console.log('Activity watching is disabled for user:', tokens.user_id);
      }
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
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