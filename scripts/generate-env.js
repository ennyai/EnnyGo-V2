// Generate environment variables for Vite
const fs = require('fs');
const path = require('path');

// Modified to use production variable names
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Create the env content
const envContent = `
VITE_SUPABASE_URL=${process.env.SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${process.env.SUPABASE_ANON_KEY}
`.trim();

// Write to .env file
fs.writeFileSync(path.join(process.cwd(), '.env'), envContent);

console.log('Generated Vite environment variables'); 