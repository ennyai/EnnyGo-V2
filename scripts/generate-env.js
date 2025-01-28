// Generate environment variables for Vite
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Modified to use production variable names
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Create the env content
const envContent = `
VITE_SUPABASE_URL=${process.env.SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${process.env.SUPABASE_ANON_KEY}
`.trim();

// Write to .env file
writeFileSync(join(process.cwd(), '.env'), envContent);

console.log('Generated Vite environment variables:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? '[PRESENT]' : '[MISSING]',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '[PRESENT]' : '[MISSING]'
}); 