import axios from 'axios';
import { getNextTitle } from '../../utils/activity-titles.js';

export class StravaService {
  static async exchangeToken(code) {
    try {
      const response = await axios.post('https://www.strava.com/oauth/token', {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      });

      return response.data;
    } catch (error) {
      console.error('Token exchange error:', error.response?.data || error.message);
      throw new Error('Failed to exchange token with Strava');
    }
  }

  static async refreshToken(refreshToken) {
    try {
      const response = await axios.post('https://www.strava.com/oauth/token', {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      });

      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error.response?.data || error.message);
      throw new Error('Failed to refresh token with Strava');
    }
  }

  static async getActivity(activityId, accessToken) {
    try {
      const response = await axios.get(
        `https://www.strava.com/api/v3/activities/${activityId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Get activity error:', error.response?.data || error.message);
      throw new Error('Failed to fetch activity from Strava');
    }
  }

  static async updateActivityTitle(activityId, title, accessToken) {
    try {
      const response = await axios.put(
        `https://www.strava.com/api/v3/activities/${activityId}`,
        { name: title },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Update activity error:', error.response?.data || error.message);
      throw new Error('Failed to update activity title on Strava');
    }
  }

  static generateCreativeTitle(activity) {
    // Use our new title system
    return getNextTitle();
  }

  static async getAthleteActivities(accessToken, page = 1) {
    try {
      const response = await axios.get(
        'https://www.strava.com/api/v3/athlete/activities',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            page,
            per_page: 30
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Get activities error:', error.response?.data || error.message);
      throw new Error('Failed to fetch athlete activities from Strava');
    }
  }

  static async getAthlete(accessToken) {
    try {
      const response = await axios.get('https://www.strava.com/api/v3/athlete', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      console.error('Get athlete error:', error.response?.data || error.message);
      throw new Error('Failed to fetch athlete data from Strava');
    }
  }

  static async getAthleteStats(athleteId, accessToken) {
    try {
      const response = await axios.get(
        `https://www.strava.com/api/v3/athletes/${athleteId}/stats`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Get athlete stats error:', error.response?.data || error.message);
      throw new Error('Failed to fetch athlete stats from Strava');
    }
  }

  static async createActivity(accessToken, activityData) {
    try {
      const response = await axios.post(
        'https://www.strava.com/api/v3/activities',
        {
          name: activityData.name,
          type: activityData.type,
          start_date_local: activityData.start_date_local,
          elapsed_time: activityData.elapsed_time,
          description: activityData.description,
          distance: activityData.distance,
          trainer: activityData.trainer || 0,
          commute: activityData.commute || 0
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      console.log('Activity created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating activity:', error.response?.data || error.message);
      throw error;
    }
  }
}
