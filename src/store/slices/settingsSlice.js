import { createSlice } from '@reduxjs/toolkit';
import { clientStorage } from '../../utils/storage';

// Initialize with false, ignoring any stored value
const initialState = {
  watchActivities: false,
  isLoading: false,
  error: null
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
      state.watchActivities = action.payload;
    },
    resetSettings: (state) => {
      state.watchActivities = false;
      // Clear settings in client storage
      clientStorage.setSettings({ ...clientStorage.getSettings(), watchActivities: false });
    },
    startSettingsUpdate: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    settingsUpdateSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    settingsUpdateFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  },
});

export const {
  toggleWatchActivities,
  setWatchActivities,
  resetSettings,
  startSettingsUpdate,
  settingsUpdateSuccess,
  settingsUpdateFailed
} = settingsSlice.actions;

export default settingsSlice.reducer; 