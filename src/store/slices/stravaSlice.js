import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  isConnecting: false,
  error: null,
  athlete: null
};

const stravaSlice = createSlice({
  name: 'strava',
  initialState,
  reducers: {
    startConnecting: (state) => {
      state.isConnecting = true;
      state.error = null;
    },
    connectionSuccess: (state, action) => {
      state.isConnected = true;
      state.isConnecting = false;
      state.error = null;
      if (action.payload?.athlete) {
        state.athlete = action.payload.athlete;
      }
    },
    connectionFailed: (state, action) => {
      state.isConnected = false;
      state.isConnecting = false;
      state.error = action.payload;
      state.athlete = null;
    },
    disconnected: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
      state.error = null;
      state.athlete = null;
    },
    updateAthlete: (state, action) => {
      state.athlete = action.payload;
    }
  }
});

export const {
  startConnecting,
  connectionSuccess,
  connectionFailed,
  disconnected,
  updateAthlete
} = stravaSlice.actions;

export default stravaSlice.reducer; 