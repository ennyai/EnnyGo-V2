const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const StravaService = require('../services/strava');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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
      // Get user's settings and tokens from Supabase
      const { data: tokens, error: tokenError } = await supabase
        .from('strava_tokens')
        .select('access_token, user_id')
        .eq('user_id', event.owner_id)
        .single();

      if (tokenError) {
        console.error('Error fetching tokens:', tokenError);
        return;
      }

      // Get user settings
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('settings')
        .eq('id', tokens.user_id)
        .single();

      if (userError) {
        console.error('Error fetching user settings:', userError);
        return;
      }

      if (user?.settings?.watchActivities) {
        // Get the full activity details from Strava
        const activity = await StravaService.getActivity(event.object_id, tokens.access_token);
        
        // Generate a creative title
        const newTitle = StravaService.generateCreativeTitle(activity);
        
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

        console.log(`Updated activity ${event.object_id} title to: ${newTitle}`);
      }
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
  }
});

module.exports = router; 