import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration
const getSupabaseConfig = () => {
  // Try different ways to get the config
  const config = {
    // Try import.meta.env first (Vite's way)
    url: import.meta.env?.VITE_SUPABASE_URL,
    key: import.meta.env?.VITE_SUPABASE_ANON_KEY,
  };

  // Log the current environment and configuration status
  console.log('Environment:', import.meta.env.MODE);
  console.log('Supabase Config Status:', {
    hasUrl: Boolean(config.url),
    hasKey: Boolean(config.key),
  });

  return config;
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig();

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
    'Missing Supabase configuration:',
    {
      url: supabaseUrl ? 'present' : 'missing',
      key: supabaseAnonKey ? 'present' : 'missing'
    }
  );
  supabase = createMockClient();
} else {
  // Create the real Supabase client with the provided configuration
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase }; 