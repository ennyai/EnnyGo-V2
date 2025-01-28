import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check for missing environment variables
const missingVars = [];
if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');

// Create a mock client for when configuration is missing
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signIn: () => Promise.reject(new Error('Authentication unavailable - Missing configuration')),
    signOut: () => Promise.reject(new Error('Authentication unavailable - Missing configuration')),
    onAuthStateChange: (callback) => {
      // Immediately call callback with null session to indicate no auth
      callback('SIGNED_OUT', null);
      // Return a mock subscription that does nothing
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  },
  from: (table) => ({
    select: () => Promise.reject(new Error(`Database unavailable - Cannot select from ${table}`)),
    insert: () => Promise.reject(new Error(`Database unavailable - Cannot insert into ${table}`)),
    update: () => Promise.reject(new Error(`Database unavailable - Cannot update ${table}`)),
    delete: () => Promise.reject(new Error(`Database unavailable - Cannot delete from ${table}`))
  })
});

let supabase;

if (missingVars.length > 0) {
  console.error(
    'Missing Supabase environment variables:',
    missingVars.join(', '),
    '\nPlease add these to your Railway environment variables with the VITE_ prefix.'
  );
  
  // Use mock client in production, throw error in development
  if (import.meta.env.PROD) {
    supabase = createMockClient();
  } else {
    throw new Error(`Missing Supabase environment variables: ${missingVars.join(', ')}`);
  }
} else {
  // Create the real Supabase client with the provided configuration
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase }; 