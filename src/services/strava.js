import axios from 'axios';
import { clientStorage } from '../utils/storage';
import { getNextTitle, formatTitle } from '../utils/activity-titles';

const STRAVA_CONFIG = {
  clientId: import.meta.env.VITE_STRAVA_CLIENT_ID,
  clientSecret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_STRAVA_REDIRECT_URI,
  authUrl: import.meta.env.VITE_STRAVA_AUTH_URL,
  tokenUrl: import.meta.env.VITE_STRAVA_TOKEN_URL,
};

class StravaService {
  static getAuthUrl(userId) {
    if (!userId) {
      throw new Error('User ID is required for Strava authorization');
    }
    
    // Updated scopes to include read and write permissions
    const scope = 'read,profile:read_all,activity:read,activity:read_all,activity:write';
    return `${STRAVA_CONFIG.authUrl}?client_id=${STRAVA_CONFIG.clientId}&response_type=code&redirect_uri=${STRAVA_CONFIG.redirectUri}&scope=${scope}&approval_prompt=force&state=${userId}`;
  }

  static async exchangeToken(code) {
    try {
      console.log('Exchanging token with code:', code);
      const params = new URLSearchParams({
        client_id: STRAVA_CONFIG.clientId,
        client_secret: STRAVA_CONFIG.clientSecret,
        code: code,
        grant_type: 'authorization_code',
      });

      console.log('Token exchange URL:', `${STRAVA_CONFIG.tokenUrl}?${params.toString()}`);
      const response = await axios.post(`${STRAVA_CONFIG.tokenUrl}?${params.toString()}`);
      console.log('Token exchange response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error exchanging token:', error.response?.data || error.message);
      throw error;
    }
  }

  static async refreshToken(refreshToken) {
    try {
      console.log('Refreshing token...');
      const params = new URLSearchParams({
        client_id: STRAVA_CONFIG.clientId,
        client_secret: STRAVA_CONFIG.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      });

      const response = await axios.post(`${STRAVA_CONFIG.tokenUrl}?${params.toString()}`);
      console.log('Token refresh successful');
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error.response?.data || error.message);
      throw error;
    }
  }

  static async getAthleteData(accessToken) {
    try {
      const response = await axios.get('https://www.strava.com/api/v3/athlete', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      console.log('Athlete data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching athlete data:', error.response?.data || error.message);
      throw error;
    }
  }

  static async getActivities(params = {}) {
    try {
      const tokens = clientStorage.getStravaTokens();
      if (!tokens || !tokens.access_token) {
        throw new Error('No access token found');
      }

      // Check if token is expired or will expire in the next minute
      const isTokenExpired = tokens.expires_at * 1000 <= Date.now() + 60000;
      
      let accessToken = tokens.access_token;
      
      if (isTokenExpired) {
        console.log('Token is expired, refreshing before fetching activities...');
        try {
          const refreshedTokens = await this.refreshToken(tokens.refresh_token);
          accessToken = refreshedTokens.access_token;
          clientStorage.setStravaTokens(refreshedTokens);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          clientStorage.clearStravaData();
          throw new Error('Failed to refresh expired token');
        }
      }

      const { page = 1, per_page = 30, before, after } = params;
      
      const queryParams = new URLSearchParams({
        page,
        per_page,
        ...(before && { before }),
        ...(after && { after })
      });

      const response = await axios.get(`https://www.strava.com/api/v3/athlete/activities?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      console.log(`Fetched ${response.data.length} activities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error.response?.data || error.message);
      throw error;
    }
  }

  static async getActivity(activityId, accessToken) {
    try {
      const response = await axios.get(`https://www.strava.com/api/v3/activities/${activityId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching activity:', error);
      throw error;
    }
  }

  static async updateActivityTitle(activityId, newTitle, accessToken) {
    try {
      const response = await axios.put(
        `https://www.strava.com/api/v3/activities/${activityId}`,
        { name: newTitle },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating activity title:', error);
      throw error;
    }
  }

  static generateCreativeTitle(activity) {
    const titleTemplate = getNextTitle();
    return formatTitle(titleTemplate, activity);
  }
}

export default StravaService;