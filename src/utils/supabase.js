import { createClient } from '@supabase/supabase-js';

// Modified environment variable handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    Missing Supabase environment variables. 
    Received:
    - URL: ${supabaseUrl ? '*****' : 'MISSING'}
    - Anon Key: ${supabaseAnonKey ? '*****' : 'MISSING'}
  `);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common database operations
export const db = {
  // User operations
  async getUser(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Strava integration
  async saveStravaTokens(userId, tokens) {
    const { data, error } = await supabase
      .from('strava_tokens')
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_at
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getStravaTokens(userId) {
    const { data, error } = await supabase
      .from('strava_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Activity operations
  async saveActivity(activity) {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        strava_id: activity.id,
        user_id: activity.athlete.id,
        name: activity.name,
        type: activity.type,
        distance: activity.distance,
        moving_time: activity.moving_time,
        start_date: activity.start_date,
        start_latlng: activity.start_latlng,
        end_latlng: activity.end_latlng,
        average_speed: activity.average_speed,
        max_speed: activity.max_speed,
        total_elevation_gain: activity.total_elevation_gain
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getActivities(userId, { page = 1, limit = 10 } = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('activities')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('start_date', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    return { data, count };
  }
}; 