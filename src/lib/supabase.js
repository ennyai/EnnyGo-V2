import { createClient } from '@supabase/supabase-js';

// Get configuration from runtime config
const getConfig = () => {
  if (typeof window !== 'undefined' && window.ENV) {
    return {
      supabaseUrl: window.ENV.VITE_SUPABASE_URL,
      supabaseAnonKey: window.ENV.VITE_SUPABASE_ANON_KEY
    };
  }
  return {
    supabaseUrl: '',
    supabaseAnonKey: ''
  };
};

const { supabaseUrl, supabaseAnonKey } = getConfig();

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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase configuration. Please check your environment variables.'
  );
  supabase = createMockClient();
} else {
  // Create the real Supabase client with the provided configuration
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase }; 