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
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Required Frontend Variables
const stravaClientId = process.env.VITE_STRAVA_CLIENT_ID;
const stravaClientSecret = process.env.VITE_STRAVA_CLIENT_SECRET;
const stravaRedirectUri = process.env.VITE_STRAVA_REDIRECT_URI;
const frontendUrl = process.env.FRONTEND_URL;

// Validate Backend Variables
console.log('\nValidating Backend Variables:');
if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
  console.error('❌ Error: Invalid or missing SUPABASE_URL');
  process.exit(1);
} else {
  console.log('✅ SUPABASE_URL: Valid');
}

if (!supabaseAnonKey || supabaseAnonKey.length < 1) {
  console.error('❌ Error: Invalid or missing SUPABASE_ANON_KEY');
  process.exit(1);
} else {
  console.log('✅ SUPABASE_ANON_KEY: Present and valid');
}

if (!supabaseServiceRoleKey || supabaseServiceRoleKey.length < 1) {
  console.error('❌ Error: Invalid or missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
} else {
  console.log('✅ SUPABASE_SERVICE_ROLE_KEY: Present and valid');
}

// Validate Frontend Variables
console.log('\nValidating Frontend Variables:');
if (!stravaClientId || isNaN(Number(stravaClientId))) {
  console.error('❌ Error: Invalid or missing VITE_STRAVA_CLIENT_ID');
  process.exit(1);
} else {
  console.log('✅ VITE_STRAVA_CLIENT_ID:', stravaClientId);
}

if (!stravaClientSecret || stravaClientSecret.length < 1) {
  console.error('❌ Error: Invalid or missing VITE_STRAVA_CLIENT_SECRET');
  process.exit(1);
} else {
  console.log('✅ VITE_STRAVA_CLIENT_SECRET: Present and valid');
}

if (!stravaRedirectUri || !isValidUrl(stravaRedirectUri)) {
  console.error('❌ Error: Invalid or missing VITE_STRAVA_REDIRECT_URI');
  process.exit(1);
} else {
  console.log('✅ VITE_STRAVA_REDIRECT_URI:', stravaRedirectUri);
}

if (!frontendUrl || !isValidUrl(frontendUrl)) {
  console.error('❌ Error: Invalid or missing FRONTEND_URL');
  process.exit(1);
} else {
  console.log('✅ FRONTEND_URL:', frontendUrl);
}

// Optional Frontend Variables (with defaults)
const stravaAuthUrl = process.env.VITE_STRAVA_AUTH_URL || 'https://www.strava.com/oauth/authorize';
const stravaTokenUrl = process.env.VITE_STRAVA_TOKEN_URL || 'https://www.strava.com/oauth/token';
const apiUrl = process.env.VITE_API_URL || process.env.FRONTEND_URL + '/api';
const stravaWebhookUrl = process.env.VITE_STRAVA_WEBHOOK_URL || process.env.WEBHOOK_CALLBACK_URL;
const stravaVerifyToken = process.env.STRAVA_VERIFY_TOKEN || 'default_verify_token';

console.log('\nOptional variables:');
console.log('ℹ️ VITE_STRAVA_AUTH_URL:', stravaAuthUrl);
console.log('ℹ️ VITE_STRAVA_TOKEN_URL:', stravaTokenUrl);
console.log('ℹ️ VITE_API_URL:', apiUrl);
console.log('ℹ️ VITE_STRAVA_WEBHOOK_URL:', stravaWebhookUrl);
console.log('ℹ️ STRAVA_VERIFY_TOKEN:', stravaVerifyToken ? 'Present' : 'Missing');

// Create the .env file content
const envContent = `# Backend Variables
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceRoleKey}
FRONTEND_URL=${frontendUrl}
STRAVA_VERIFY_TOKEN=${stravaVerifyToken}
WEBHOOK_CALLBACK_URL=${process.env.WEBHOOK_CALLBACK_URL || stravaWebhookUrl}

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