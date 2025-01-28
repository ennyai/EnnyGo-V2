import express from 'express';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { StravaService } from '../services/strava.js';
import { config } from '../config/env.js';

const router = express.Router();

// Initialize Supabase client with service role key for backend access
const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);

// Log successful initialization
console.log('Supabase client initialized successfully');

// Webhook verification endpoint
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.strava.verifyToken) {
    res.json({ 'hub.challenge': challenge });
  } else {
    res.sendStatus(403);
  }
});

// Webhook event handler
router.post('/webhook', async (req, res) => {
  const { object_type, aspect_type, owner_id, object_id } = req.body;

  // Always respond quickly to the webhook
  res.status(200).send('EVENT_RECEIVED');

  // Only process activity creations
  if (object_type !== 'activity' || aspect_type !== 'create') {
    return;
  }

  try {
    // Get the user's Strava tokens
    const { data: tokens, error: tokenError } = await supabase
      .from('strava_tokens')
      .select('user_id, access_token, refresh_token, expires_at')
      .eq('strava_athlete_id', owner_id.toString())
      .single();

    if (tokenError || !tokens) {
      console.error('Error fetching tokens:', tokenError);
      return;
    }

    // Check if token needs refresh
    const now = Math.floor(Date.now() / 1000);
    let accessToken = tokens.access_token;

    if (tokens.expires_at < now) {
      console.log('Token expired, refreshing...');
      try {
        const refreshedData = await StravaService.refreshToken(tokens.refresh_token);
        accessToken = refreshedData.access_token;
        
        // Update tokens in database
        const { error: updateError } = await supabase
          .from('strava_tokens')
          .update({
            access_token: refreshedData.access_token,
            refresh_token: refreshedData.refresh_token,
            expires_at: refreshedData.expires_at
          })
          .eq('strava_athlete_id', owner_id.toString());

        if (updateError) {
          console.error('Error updating tokens:', updateError);
          return;
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return;
      }
    }

    // Get user settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('watch_activities')
      .eq('user_id', tokens.user_id)
      .single();

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      return;
    }

    // Check if user wants activities to be watched
    if (!settings?.watch_activities) {
      console.log('User has disabled activity watching');
      return;
    }

    // Get activity details from Strava using refreshed token
    const activity = await StravaService.getActivity(object_id, accessToken);

    // Generate creative title
    const newTitle = StravaService.generateCreativeTitle(activity);
    
    // Update activity title
    await StravaService.updateActivityTitle(object_id, newTitle, accessToken);

    // Store activity in database
    const { error: insertError } = await supabase
      .from('activities')
      .insert({
        user_id: tokens.user_id,
        strava_id: object_id,
        name: newTitle,
        type: activity.type,
        distance: activity.distance,
        moving_time: activity.moving_time,
        total_elevation_gain: activity.total_elevation_gain,
        start_date: activity.start_date
      });

    if (insertError) {
      console.error('Error storing activity:', insertError);
    }

  } catch (error) {
    console.error('Error processing webhook:', error);
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

export default router; 