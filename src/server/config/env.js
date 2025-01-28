import dotenv from 'dotenv';

// Load environment variables, but don't fail if .env file is missing
dotenv.config({ silent: true });

// Validate required environment variables (only in non-production environments)
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRAVA_VERIFY_TOKEN'
];

// Only validate required env vars in development
if (process.env.NODE_ENV !== 'production') {
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
  }
}

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },
  strava: {
    verifyToken: process.env.STRAVA_VERIFY_TOKEN || '',
    webhookCallbackUrl: process.env.WEBHOOK_CALLBACK_URL || ''
  }
}; 