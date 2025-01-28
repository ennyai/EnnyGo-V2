import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check for missing environment variables
const missingVars = [];
if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');

let supabase;

if (missingVars.length > 0) {
  console.error(
    'Missing Supabase environment variables:',
    missingVars.join(', '),
    '\nPlease add these to your Railway environment variables with the VITE_ prefix.'
  );
  // In production, use a fallback client that will show appropriate UI messages
  if (import.meta.env.PROD) {
    supabase = {
      auth: {
        signIn: () => Promise.reject(new Error('Authentication unavailable - Missing configuration')),
        signOut: () => Promise.reject(new Error('Authentication unavailable - Missing configuration')),
        onAuthStateChange: () => ({ data: null, error: new Error('Authentication unavailable') })
      },
      from: () => ({
        select: () => Promise.reject(new Error('Database unavailable - Missing configuration')),
        insert: () => Promise.reject(new Error('Database unavailable - Missing configuration')),
        update: () => Promise.reject(new Error('Database unavailable - Missing configuration')),
        delete: () => Promise.reject(new Error('Database unavailable - Missing configuration'))
      })
    };
  } else {
    throw new Error(`Missing Supabase environment variables: ${missingVars.join(', ')}`);
  }
} else {
  // Create the Supabase client with the provided configuration
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase }; 