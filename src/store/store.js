import { configureStore } from '@reduxjs/toolkit';
import stravaReducer from './slices/stravaSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    strava: stravaReducer,
    settings: settingsReducer,
  },
});

export default store; 