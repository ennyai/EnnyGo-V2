// Generate environment variables for Vite
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const stravaClientId = process.env.VITE_STRAVA_CLIENT_ID;
const stravaClientSecret = process.env.VITE_STRAVA_CLIENT_SECRET;
const stravaRedirectUri = process.env.VITE_STRAVA_REDIRECT_URI;
const stravaAuthUrl = process.env.VITE_STRAVA_AUTH_URL;
const stravaTokenUrl = process.env.VITE_STRAVA_TOKEN_URL;
const apiUrl = process.env.VITE_API_URL;
const stravaWebhookUrl = process.env.VITE_STRAVA_WEBHOOK_URL;

// Validate required variables
if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
  console.error('Error: Invalid or missing SUPABASE_URL');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('Error: Missing SUPABASE_ANON_KEY');
  process.exit(1);
}

if (!stravaClientId) {
  console.error('Error: Missing VITE_STRAVA_CLIENT_ID');
  process.exit(1);
}

if (!stravaClientSecret) {
  console.error('Error: Missing VITE_STRAVA_CLIENT_SECRET');
  process.exit(1);
}

if (!stravaRedirectUri || !isValidUrl(stravaRedirectUri)) {
  console.error('Error: Invalid or missing VITE_STRAVA_REDIRECT_URI');
  process.exit(1);
}

// Create the .env file content
const envContent = `VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}
VITE_STRAVA_CLIENT_ID=${stravaClientId}
VITE_STRAVA_CLIENT_SECRET=${stravaClientSecret}
VITE_STRAVA_REDIRECT_URI=${stravaRedirectUri}
VITE_STRAVA_AUTH_URL=${stravaAuthUrl || 'https://www.strava.com/oauth/authorize'}
VITE_STRAVA_TOKEN_URL=${stravaTokenUrl || 'https://www.strava.com/oauth/token'}
VITE_API_URL=${apiUrl || 'https://ennygo-v2-production.up.railway.app/api'}
VITE_STRAVA_WEBHOOK_URL=${stravaWebhookUrl || 'https://ennygo-v2-production.up.railway.app/api/strava/webhook'}
`;

// Write to .env file
const envPath = path.join(__dirname, '..', '.env');
fs.writeFileSync(envPath, envContent);

// Log status (without exposing sensitive values)
console.log('\nEnvironment variables written to .env file:');
console.log('VITE_SUPABASE_URL:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY:', '[HIDDEN]');
console.log('VITE_STRAVA_CLIENT_ID:', stravaClientId);
console.log('VITE_STRAVA_CLIENT_SECRET:', '[HIDDEN]');
console.log('VITE_STRAVA_REDIRECT_URI:', stravaRedirectUri);
console.log('VITE_STRAVA_AUTH_URL:', stravaAuthUrl || '[DEFAULT]');
console.log('VITE_STRAVA_TOKEN_URL:', stravaTokenUrl || '[DEFAULT]');
console.log('VITE_API_URL:', apiUrl || '[DEFAULT]');
console.log('VITE_STRAVA_WEBHOOK_URL:', stravaWebhookUrl || '[DEFAULT]'); 