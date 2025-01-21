const axios = require('axios');
const { tokenManager } = require('../../utils/token-manager');

const STRAVA_CONFIG = {
  clientId: process.env.STRAVA_CLIENT_ID,
  clientSecret: process.env.STRAVA_CLIENT_SECRET,
  redirectUri: process.env.STRAVA_REDIRECT_URI,
  authUrl: process.env.STRAVA_AUTH_URL,
  tokenUrl: process.env.STRAVA_TOKEN_URL,
};

class StravaService {
  static async getActivity(activityId, accessToken) {
    try {
      const response = await axios.get(
        `https://www.strava.com/api/v3/activities/${activityId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching activity:', error.response?.data || error.message);
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

module.exports = StravaService; 