import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const checkWebhookSetup = async () => {
  console.log('Checking Strava webhook setup...');
  
  // 1. Check if ngrok is accessible
  try {
    const webhookUrl = process.env.WEBHOOK_CALLBACK_URL;
    console.log(`Testing webhook URL: ${webhookUrl}`);
    
    const response = await axios.get(webhookUrl);
    console.log('✅ Webhook URL is accessible');
  } catch (error) {
    console.error('❌ Webhook URL is not accessible. Make sure ngrok is running.');
    console.error('Run: ngrok http 3001');
    return;
  }

  // 2. Check Strava API credentials
  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.VITE_STRAVA_CLIENT_ID,
      client_secret: process.env.VITE_STRAVA_CLIENT_SECRET,
      grant_type: 'client_credentials'
    });
    
    if (response.data) {
      console.log('✅ Strava credentials are valid');
    }
  } catch (error) {
    console.error('❌ Strava credentials are invalid');
    console.error(error.response?.data || error.message);
  }
};

checkWebhookSetup().catch(console.error); 