import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import activityReducer from './slices/activitySlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    activities: activityReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setCredentials'],
      },
    }),
}); 