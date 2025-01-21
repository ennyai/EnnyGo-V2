import axios from 'axios';
import { storage } from '../utils/storage';

const STRAVA_CONFIG = {
  clientId: import.meta.env.VITE_STRAVA_CLIENT_ID,
  clientSecret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_STRAVA_REDIRECT_URI,
  authUrl: import.meta.env.VITE_STRAVA_AUTH_URL,
  tokenUrl: import.meta.env.VITE_STRAVA_TOKEN_URL,
};

class StravaService {
  static getAuthUrl() {
    // Updated scopes to include read and write permissions
    const scope = 'read,profile:read_all,activity:read,activity:read_all,activity:write';
    return `${STRAVA_CONFIG.authUrl}?client_id=${STRAVA_CONFIG.clientId}&response_type=code&redirect_uri=${STRAVA_CONFIG.redirectUri}&scope=${scope}&approval_prompt=force`;
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
      const tokens = storage.getStravaTokens();
      if (!tokens || !tokens.access_token) {
        throw new Error('No access token found');
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
          'Authorization': `Bearer ${tokens.access_token}`
        }
      });

      console.log(`Fetched ${response.data.length} activities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error.response?.data || error.message);
      throw error;
    }
  }

  static async refreshToken(refreshToken) {
    try {
      const params = new URLSearchParams({
        client_id: STRAVA_CONFIG.clientId,
        client_secret: STRAVA_CONFIG.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      });

      const response = await axios.post(`${STRAVA_CONFIG.tokenUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error.response?.data || error.message);
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
    const type = activity.type.toLowerCase();
    const distance = (activity.distance / 1000).toFixed(1);
    const time = Math.floor(activity.moving_time / 60);
    
    const titles = [
      `Epic ${type} Adventure: ${distance}km of Pure Joy!`,
      `${distance}km ${type} Journey - ${time} Minutes of Freedom`,
      `Conquering ${distance}km on a ${type} Quest`,
      `${type} Exploration: ${distance}km of Discovery`,
      `${time}-Minute ${type} Escape: ${distance}km of Bliss`
    ];
    
    return titles[Math.floor(Math.random() * titles.length)];
  }
}

export default StravaService; 