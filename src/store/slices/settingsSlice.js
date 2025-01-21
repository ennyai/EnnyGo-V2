import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage';

const initialState = {
  watchActivities: storage.getSettings()?.watchActivities || false,
  // Add more settings as needed
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleWatchActivities: (state) => {
      state.watchActivities = !state.watchActivities;
      storage.setSettings({ ...storage.getSettings(), watchActivities: state.watchActivities });
    },
    // Add more settings reducers as needed
  },
});

export const { toggleWatchActivities } = settingsSlice.actions;
export default settingsSlice.reducer; 