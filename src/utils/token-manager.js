import { storage } from '../server/utils/storage.js';
import axios from 'axios';

export const tokenManager = {
  isTokenExpired: (expiresAt) => {
    // Check if token expires in the next 5 minutes
    return Date.now() >= (expiresAt * 1000) - (5 * 60 * 1000);
  },

  getValidToken: async () => {
    const tokens = storage.getStravaTokens();
    
    if (!tokens) {
      throw new Error('No tokens found');
    }

    // If token is not expired, return it
    if (!tokenManager.isTokenExpired(tokens.expires_at)) {
      return tokens.access_token;
    }

    // Token is expired, try to refresh
    try {
      const response = await axios.post('https://www.strava.com/oauth/token', {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: tokens.refresh_token,
        grant_type: 'refresh_token'
      });
      
      const newTokens = response.data;
      storage.setStravaTokens(newTokens);
      return newTokens.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      storage.clearStravaData(); // Clear invalid tokens
      throw new Error('Failed to refresh token');
    }
  }
}; 