const STORAGE_KEYS = {
  STRAVA_TOKENS: 'strava_tokens',
  STRAVA_ATHLETE: 'strava_athlete',
  SETTINGS: 'enny_settings'
};

export const storage = {
  setStravaTokens: (tokens) => {
    localStorage.setItem(STORAGE_KEYS.STRAVA_TOKENS, JSON.stringify(tokens));
  },

  getStravaTokens: () => {
    const tokens = localStorage.getItem(STORAGE_KEYS.STRAVA_TOKENS);
    return tokens ? JSON.parse(tokens) : null;
  },

  setStravaAthlete: (athlete) => {
    localStorage.setItem(STORAGE_KEYS.STRAVA_ATHLETE, JSON.stringify(athlete));
  },

  getStravaAthlete: () => {
    const athlete = localStorage.getItem(STORAGE_KEYS.STRAVA_ATHLETE);
    return athlete ? JSON.parse(athlete) : null;
  },

  clearStravaData: () => {
    localStorage.removeItem(STORAGE_KEYS.STRAVA_TOKENS);
    localStorage.removeItem(STORAGE_KEYS.STRAVA_ATHLETE);
  },

  setSettings: (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getSettings: () => {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {};
  },

  clearSettings: () => {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
};

export { STORAGE_KEYS }; 