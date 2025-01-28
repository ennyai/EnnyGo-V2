// Generate environment variables for Vite
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Validate URL format
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Validate variables
if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
  console.error('Invalid or missing SUPABASE_URL:', supabaseUrl);
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('Missing SUPABASE_ANON_KEY');
  process.exit(1);
}

// Create the env content
const envContent = `
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}
`.trim();

// Write to .env file
writeFileSync(join(process.cwd(), '.env'), envContent);

console.log('Generated Vite environment variables:', {
  SUPABASE_URL: isValidUrl(supabaseUrl) ? '[VALID URL]' : '[INVALID URL]',
  SUPABASE_ANON_KEY: supabaseAnonKey ? '[PRESENT]' : '[MISSING]'
}); 