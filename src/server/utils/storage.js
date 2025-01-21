const STORAGE_KEYS = {
  STRAVA_TOKENS: 'strava_tokens',
  STRAVA_ATHLETE: 'strava_athlete',
  SETTINGS: 'enny_settings'
};

// Server-side storage implementation
const storage = {
  // We'll use in-memory storage for now
  // In production, you'd want to use Redis or a database
  _data: new Map(),

  setStravaTokens: (tokens) => {
    storage._data.set(STORAGE_KEYS.STRAVA_TOKENS, tokens);
  },

  getStravaTokens: () => {
    return storage._data.get(STORAGE_KEYS.STRAVA_TOKENS) || null;
  },

  setStravaAthlete: (athlete) => {
    storage._data.set(STORAGE_KEYS.STRAVA_ATHLETE, athlete);
  },

  getStravaAthlete: () => {
    return storage._data.get(STORAGE_KEYS.STRAVA_ATHLETE) || null;
  },

  clearStravaData: () => {
    storage._data.delete(STORAGE_KEYS.STRAVA_TOKENS);
    storage._data.delete(STORAGE_KEYS.STRAVA_ATHLETE);
  },

  setSettings: (settings) => {
    storage._data.set(STORAGE_KEYS.SETTINGS, settings);
  },

  getSettings: () => {
    return storage._data.get(STORAGE_KEYS.SETTINGS) || {};
  },

  clearSettings: () => {
    storage._data.delete(STORAGE_KEYS.SETTINGS);
  }
};

module.exports = { storage, STORAGE_KEYS }; 