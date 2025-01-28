import axios from 'axios';

export async function setupStravaWebhook() {
  try {
    const response = await axios.post('https://www.strava.com/api/v3/push_subscriptions', {
      client_id: process.env.VITE_STRAVA_CLIENT_ID,
      client_secret: process.env.VITE_STRAVA_CLIENT_SECRET,
      callback_url: process.env.WEBHOOK_CALLBACK_URL,
      verify_token: process.env.STRAVA_VERIFY_TOKEN,
    });

    console.log('Successfully subscribed to Strava webhooks:', response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('Webhook subscription already exists');
      return;
    }
    console.error('Error setting up Strava webhook:', error.response?.data || error.message);
    throw error;
  }
}

// Function to view existing subscriptions
export async function listSubscriptions() {
  try {
    const response = await axios.get('https://www.strava.com/api/v3/push_subscriptions', {
      params: {
        client_id: process.env.VITE_STRAVA_CLIENT_ID,
        client_secret: process.env.VITE_STRAVA_CLIENT_SECRET,
      }
    });

    console.log('Current webhook subscriptions:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error listing webhook subscriptions:', error.response?.data || error.message);
    throw error;
  }
}

// Function to delete a subscription
export async function deleteSubscription(id) {
  try {
    await axios.delete(`https://www.strava.com/api/v3/push_subscriptions/${id}`, {
      params: {
        client_id: process.env.VITE_STRAVA_CLIENT_ID,
        client_secret: process.env.VITE_STRAVA_CLIENT_SECRET,
      }
    });

    console.log(`Successfully deleted subscription ${id}`);
  } catch (error) {
    console.error('Error deleting webhook subscription:', error.response?.data || error.message);
    throw error;
  }
} 