require('dotenv').config();
const { setupStravaWebhook, listSubscriptions, deleteSubscription } = require('../utils/setupWebhook');

async function resetWebhook() {
  try {
    console.log('Listing current subscriptions...');
    const subscriptions = await listSubscriptions();
    console.log('Current subscriptions:', subscriptions);

    // Delete existing subscriptions
    for (const sub of subscriptions) {
      console.log(`Deleting subscription ${sub.id}...`);
      await deleteSubscription(sub.id);
      console.log(`Subscription ${sub.id} deleted.`);
    }

    // Create new subscription
    console.log('Creating new subscription...');
    const result = await setupStravaWebhook();
    console.log('New subscription created:', result);
  } catch (error) {
    console.error('Error resetting webhook:', error);
  }
}

resetWebhook(); 