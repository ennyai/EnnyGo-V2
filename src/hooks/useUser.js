import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    async function getInitialSession() {
      try {
        if (!supabase.auth) {
          throw new Error('Supabase client is not properly initialized');
        }
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    let subscription;
    try {
      if (!supabase.auth) {
        throw new Error('Supabase client is not properly initialized');
      }
      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
      subscription = authListener.subscription;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setError(error.message);
      setLoading(false);
    }

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return { 
    user, 
    loading, 
    error,
    isInitialized: Boolean(supabase.auth)
  };
} 