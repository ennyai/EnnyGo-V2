import { createSlice } from '@reduxjs/toolkit';
import { clientStorage } from '../../utils/storage';

// Initialize with false, ignoring any stored value
const initialState = {
  watchActivities: false,
  // Add more settings as needed
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleWatchActivities: (state) => {
      state.watchActivities = !state.watchActivities;
      // Update client storage
      clientStorage.setSettings({ ...clientStorage.getSettings(), watchActivities: state.watchActivities });
    },
    setWatchActivities: (state, action) => {
      // Ensure the value is a boolean
      state.watchActivities = Boolean(action.payload);
      // Update client storage
      clientStorage.setSettings({ ...clientStorage.getSettings(), watchActivities: state.watchActivities });
    },
    resetSettings: (state) => {
      state.watchActivities = false;
      // Clear settings in client storage
      clientStorage.setSettings({ ...clientStorage.getSettings(), watchActivities: false });
    },
    // Add more settings reducers as needed
  },
});

export const { toggleWatchActivities, setWatchActivities, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer; 