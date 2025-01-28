import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function cleanup() {
  try {
    console.log('Starting cleanup...');

    // Clear activities
    const { error: activitiesError } = await supabase
      .from('activities')
      .delete()
      .neq('id', 0); // Delete all rows

    if (activitiesError) {
      console.error('Error clearing activities:', activitiesError);
    } else {
      console.log('Activities cleared');
    }

    // Clear strava_tokens
    const { error: tokensError } = await supabase
      .from('strava_tokens')
      .delete()
      .neq('id', 0);

    if (tokensError) {
      console.error('Error clearing strava_tokens:', tokensError);
    } else {
      console.log('Strava tokens cleared');
    }

    // Clear user_settings
    const { error: settingsError } = await supabase
      .from('user_settings')
      .delete()
      .neq('id', 0);

    if (settingsError) {
      console.error('Error clearing user_settings:', settingsError);
    } else {
      console.log('User settings cleared');
    }

    console.log('Cleanup completed successfully!');
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

cleanup(); 