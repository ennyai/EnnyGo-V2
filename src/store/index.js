import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import activityReducer from './slices/activitySlice';
import uiReducer from './slices/uiSlice';
import stravaReducer from './slices/stravaSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    activities: activityReducer,
    ui: uiReducer,
    strava: stravaReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setCredentials'],
      },
    }),
});

export default store; 