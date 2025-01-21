const express = require('express');
const router = express.Router();
const StravaService = require('../services/strava');
const User = require('../models/user');

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
  
  // Acknowledge receipt of the event
  res.status(200).send('EVENT_RECEIVED');
  
  try {
    // Only process 'create' events for activities
    if (event.aspect_type === 'create' && event.object_type === 'activity') {
      // Find the user associated with this Strava athlete
      const user = await User.findOne({ 'strava.athleteId': event.owner_id });
      
      if (user && user.settings.watchActivities) {
        // Get the user's access token
        const accessToken = user.strava.accessToken;
        
        // Get the full activity details
        const activity = await StravaService.getActivity(event.object_id, accessToken);
        
        // Generate a creative title
        const newTitle = StravaService.generateCreativeTitle(activity);
        
        // Update the activity title
        await StravaService.updateActivityTitle(event.object_id, newTitle, accessToken);
        
        console.log(`Updated activity ${event.object_id} title to: ${newTitle}`);
      }
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
  }
});

module.exports = router; 