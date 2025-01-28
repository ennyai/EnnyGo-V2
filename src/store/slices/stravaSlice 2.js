import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  isConnecting: false,
  athlete: null,
  error: null,
  tokens: {
    access_token: null,
    refresh_token: null,
    expires_at: null,
  },
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
      state.tokens = {
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token,
        expires_at: action.payload.expires_at,
      };
      state.athlete = action.payload.athlete;
      state.error = null;
    },
    connectionFailed: (state, action) => {
      state.isConnected = false;
      state.isConnecting = false;
      state.error = action.payload;
    },
    disconnect: (state) => {
      return initialState;
    },
    updateTokens: (state, action) => {
      state.tokens = {
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token,
        expires_at: action.payload.expires_at,
      };
    },
  },
});

export const {
  startConnecting,
  connectionSuccess,
  connectionFailed,
  disconnect,
  updateTokens,
} = stravaSlice.actions;

export default stravaSlice.reducer; 