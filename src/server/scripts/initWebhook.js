require('dotenv').config();
const { setupStravaWebhook, listSubscriptions } = require('../utils/setupWebhook');

async function init() {
  try {
    // First, list existing subscriptions
    console.log('Checking existing subscriptions...');
    const existingSubscriptions = await listSubscriptions();
    
    if (existingSubscriptions.length > 0) {
      console.log('Existing webhook subscriptions found:', existingSubscriptions);
      return;
    }

    // If no subscriptions exist, create one
    console.log('Setting up new webhook subscription...');
    const subscription = await setupStravaWebhook();
    console.log('Webhook subscription created:', subscription);
  } catch (error) {
    console.error('Failed to initialize webhook:', error);
    process.exit(1);
  }
}

init(); 