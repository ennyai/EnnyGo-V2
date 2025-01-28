import { createClient } from '@supabase/supabase-js';

// Get production build variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create mock client if in development with missing vars
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration:', {
    url: supabaseUrl,
    key: supabaseAnonKey,
    mode: import.meta.env.MODE
  });
  supabase = createMockClient();
} else {
  // Create the real Supabase client with the provided configuration
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase }; 