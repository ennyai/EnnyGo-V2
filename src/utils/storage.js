const STORAGE_KEYS = {
  STRAVA_TOKENS: 'strava_tokens',
  STRAVA_ATHLETE: 'strava_athlete',
  SETTINGS: 'enny_settings'
};

export const storage = {
  setStravaTokens: (tokens) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEYS.STRAVA_TOKENS, JSON.stringify(tokens));
    }
  },

  getStravaTokens: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const tokens = localStorage.getItem(STORAGE_KEYS.STRAVA_TOKENS);
      return tokens ? JSON.parse(tokens) : null;
    }
    return null;
  },

  setStravaAthlete: (athlete) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEYS.STRAVA_ATHLETE, JSON.stringify(athlete));
    }
  },

  getStravaAthlete: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const athlete = localStorage.getItem(STORAGE_KEYS.STRAVA_ATHLETE);
      return athlete ? JSON.parse(athlete) : null;
    }
    return null;
  },

  clearStravaData: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEYS.STRAVA_TOKENS);
      localStorage.removeItem(STORAGE_KEYS.STRAVA_ATHLETE);
    }
  },

  setSettings: (settings) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
  },

  getSettings: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : {};
    }
    return {};
  },

  clearSettings: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    }
  }
};

export { STORAGE_KEYS }; 