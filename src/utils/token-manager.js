import { storage } from './storage';
import StravaService from '@/services/strava';

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
      const newTokens = await StravaService.refreshToken(tokens.refresh_token);
      storage.setStravaTokens(newTokens);
      return newTokens.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      storage.clearStravaData(); // Clear invalid tokens
      throw new Error('Failed to refresh token');
    }
  }
}; 