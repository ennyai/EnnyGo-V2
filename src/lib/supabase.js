import { createClient } from '@supabase/supabase-js';

// Get production build variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log the actual values (but mask the key)
console.log('Supabase Configuration:', {
  url: supabaseUrl || 'MISSING',
  key: supabaseAnonKey ? 'PRESENT' : 'MISSING',
  mode: import.meta.env.MODE,
  allEnvVars: import.meta.env // Log all available env vars
});

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

// Validate URL format
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  console.error('Invalid Supabase configuration:', {
    url: {
      value: supabaseUrl || 'MISSING',
      isValid: isValidUrl(supabaseUrl)
    },
    key: {
      present: Boolean(supabaseAnonKey),
      length: supabaseAnonKey?.length
    },
    mode: import.meta.env.MODE
  });
  supabase = createMockClient();
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client created successfully');
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    supabase = createMockClient();
  }
}

export { supabase }; 