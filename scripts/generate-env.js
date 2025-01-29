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
// Backend variables (without VITE_ prefix)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Frontend variables (with VITE_ prefix)
const viteSupabaseUrl = process.env.VITE_SUPABASE_URL || supabaseUrl;
const viteSupabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || supabaseAnonKey;
const stravaClientId = process.env.VITE_STRAVA_CLIENT_ID;
const stravaClientSecret = process.env.VITE_STRAVA_CLIENT_SECRET;
const stravaRedirectUri = process.env.VITE_STRAVA_REDIRECT_URI;
const stravaAuthUrl = process.env.VITE_STRAVA_AUTH_URL;
const stravaTokenUrl = process.env.VITE_STRAVA_TOKEN_URL;
const apiUrl = process.env.VITE_API_URL;
const stravaWebhookUrl = process.env.VITE_STRAVA_WEBHOOK_URL;

// Log all environment variables for debugging
console.log('\nAvailable environment variables:');
Object.keys(process.env).forEach(key => {
  if (key.startsWith('VITE_') || key.includes('SUPABASE')) {
    console.log(`${key}: ${key.includes('KEY') || key.includes('SECRET') ? '[HIDDEN]' : process.env[key]}`);
  }
});

// Validate backend variables
if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
  console.error('Error: Invalid or missing SUPABASE_URL');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('Error: Missing SUPABASE_ANON_KEY');
  process.exit(1);
}

// Validate frontend variables
if (!viteSupabaseUrl || !isValidUrl(viteSupabaseUrl)) {
  console.error('Error: Invalid or missing VITE_SUPABASE_URL');
  process.exit(1);
}

if (!viteSupabaseAnonKey) {
  console.error('Error: Missing VITE_SUPABASE_ANON_KEY');
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
const envContent = `SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseAnonKey}
VITE_SUPABASE_URL=${viteSupabaseUrl}
VITE_SUPABASE_ANON_KEY=${viteSupabaseAnonKey}
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
console.log('Backend variables:');
console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_ANON_KEY:', '[HIDDEN]');
console.log('\nFrontend variables:');
console.log('VITE_SUPABASE_URL:', viteSupabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY:', '[HIDDEN]');
console.log('VITE_STRAVA_CLIENT_ID:', stravaClientId);
console.log('VITE_STRAVA_CLIENT_SECRET:', '[HIDDEN]');
console.log('VITE_STRAVA_REDIRECT_URI:', stravaRedirectUri);
console.log('VITE_STRAVA_AUTH_URL:', stravaAuthUrl || '[DEFAULT]');
console.log('VITE_STRAVA_TOKEN_URL:', stravaTokenUrl || '[DEFAULT]');
console.log('VITE_API_URL:', apiUrl || '[DEFAULT]');
console.log('VITE_STRAVA_WEBHOOK_URL:', stravaWebhookUrl || '[DEFAULT]'); 