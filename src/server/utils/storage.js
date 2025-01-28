// Server-side storage implementation using in-memory Map
// Note: In production, replace this with Redis or a database
const STORAGE_KEYS = {
  STRAVA_TOKENS: 'strava_tokens',
  STRAVA_ATHLETE: 'strava_athlete',
  SETTINGS: 'enny_settings'
};

export const serverStorage = {
  // In-memory storage
  _data: new Map(),

  setStravaTokens: (tokens) => {
    serverStorage._data.set(STORAGE_KEYS.STRAVA_TOKENS, tokens);
  },

  getStravaTokens: () => {
    return serverStorage._data.get(STORAGE_KEYS.STRAVA_TOKENS) || null;
  },

  setStravaAthlete: (athlete) => {
    serverStorage._data.set(STORAGE_KEYS.STRAVA_ATHLETE, athlete);
  },

  getStravaAthlete: () => {
    return serverStorage._data.get(STORAGE_KEYS.STRAVA_ATHLETE) || null;
  },

  clearStravaData: () => {
    serverStorage._data.delete(STORAGE_KEYS.STRAVA_TOKENS);
    serverStorage._data.delete(STORAGE_KEYS.STRAVA_ATHLETE);
  },

  setSettings: (settings) => {
    serverStorage._data.set(STORAGE_KEYS.SETTINGS, settings);
  },

  getSettings: () => {
    return serverStorage._data.get(STORAGE_KEYS.SETTINGS) || {};
  },

  clearSettings: () => {
    serverStorage._data.delete(STORAGE_KEYS.SETTINGS);
  }
};

export { STORAGE_KEYS }; 