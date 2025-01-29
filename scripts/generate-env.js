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

// Log environment status for debugging
console.log('\nChecking environment variables...');

// Required Backend Variables
const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
  console.error('❌ Error: Invalid or missing SUPABASE_URL');
  process.exit(1);
} else {
  console.log('✅ SUPABASE_URL: Valid');
}

const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseAnonKey) {
  console.error('❌ Error: Missing SUPABASE_ANON_KEY');
  process.exit(1);
} else {
  console.log('✅ SUPABASE_ANON_KEY: Present');
}

// Required Frontend Variables
const stravaClientId = process.env.VITE_STRAVA_CLIENT_ID;
if (!stravaClientId) {
  console.error('❌ Error: Missing VITE_STRAVA_CLIENT_ID');
  process.exit(1);
} else {
  console.log('✅ VITE_STRAVA_CLIENT_ID:', stravaClientId);
}

const stravaClientSecret = process.env.VITE_STRAVA_CLIENT_SECRET;
if (!stravaClientSecret) {
  console.error('❌ Error: Missing VITE_STRAVA_CLIENT_SECRET');
  process.exit(1);
} else {
  console.log('✅ VITE_STRAVA_CLIENT_SECRET: Present');
}

const stravaRedirectUri = process.env.VITE_STRAVA_REDIRECT_URI;
if (!stravaRedirectUri || !isValidUrl(stravaRedirectUri)) {
  console.error('❌ Error: Invalid or missing VITE_STRAVA_REDIRECT_URI');
  process.exit(1);
} else {
  console.log('✅ VITE_STRAVA_REDIRECT_URI:', stravaRedirectUri);
}

// Optional Frontend Variables (with defaults)
const stravaAuthUrl = process.env.VITE_STRAVA_AUTH_URL || 'https://www.strava.com/oauth/authorize';
const stravaTokenUrl = process.env.VITE_STRAVA_TOKEN_URL || 'https://www.strava.com/oauth/token';
const apiUrl = process.env.VITE_API_URL || 'https://ennygo-v2-production.up.railway.app/api';
const stravaWebhookUrl = process.env.VITE_STRAVA_WEBHOOK_URL || 'https://ennygo-v2-production.up.railway.app/api/strava/webhook';

console.log('\nOptional variables:');
console.log('ℹ️ VITE_STRAVA_AUTH_URL:', stravaAuthUrl);
console.log('ℹ️ VITE_STRAVA_TOKEN_URL:', stravaTokenUrl);
console.log('ℹ️ VITE_API_URL:', apiUrl);
console.log('ℹ️ VITE_STRAVA_WEBHOOK_URL:', stravaWebhookUrl);

// Create the .env file content
const envContent = `# Backend Variables
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseAnonKey}

# Frontend Variables (Required)
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}
VITE_STRAVA_CLIENT_ID=${stravaClientId}
VITE_STRAVA_CLIENT_SECRET=${stravaClientSecret}
VITE_STRAVA_REDIRECT_URI=${stravaRedirectUri}

# Frontend Variables (Optional)
VITE_STRAVA_AUTH_URL=${stravaAuthUrl}
VITE_STRAVA_TOKEN_URL=${stravaTokenUrl}
VITE_API_URL=${apiUrl}
VITE_STRAVA_WEBHOOK_URL=${stravaWebhookUrl}
`;

// Write to .env file
const envPath = path.join(__dirname, '..', '.env');
fs.writeFileSync(envPath, envContent);

console.log('\n✅ Environment variables written to .env file successfully!'); 