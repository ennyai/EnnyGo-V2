const STORAGE_KEYS = {
  STRAVA_TOKENS: 'ennygo_strava_tokens',
  STRAVA_ATHLETE: 'ennygo_strava_athlete',
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
}; 