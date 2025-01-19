import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activities: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    per_page: 50,
    hasMore: true
  }
};

const activitySlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    fetchActivitiesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchActivitiesSuccess: (state, action) => {
      state.isLoading = false;
      // If it's the first page, replace activities, otherwise append
      if (state.pagination.page === 1) {
        state.activities = action.payload;
      } else {
        // Ensure we don't add duplicates
        const newActivities = action.payload.filter(
          newActivity => !state.activities.some(
            existingActivity => existingActivity.id === newActivity.id
          )
        );
        state.activities = [...state.activities, ...newActivities];
      }
      // If we received fewer activities than requested, we've reached the end
      state.pagination.hasMore = action.payload.length === state.pagination.per_page;
    },
    fetchActivitiesError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    resetActivities: (state) => {
      state.activities = [];
      state.pagination.page = 1;
      state.pagination.hasMore = true;
      state.error = null;
      state.isLoading = false;
    }
  }
});

export const {
  fetchActivitiesStart,
  fetchActivitiesSuccess,
  fetchActivitiesError,
  setPage,
  resetActivities
} = activitySlice.actions;

export default activitySlice.reducer; 