import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activities: [],
  recentActivities: [],
  currentActivity: null,
  isLoading: false,
  error: null,
  filters: {
    type: 'all',
    dateRange: 'week',
    sortBy: 'date'
  }
};

const activitySlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setActivities: (state, action) => {
      state.activities = action.payload;
      state.error = null;
    },
    setRecentActivities: (state, action) => {
      state.recentActivities = action.payload;
      state.error = null;
    },
    setCurrentActivity: (state, action) => {
      state.currentActivity = action.payload;
      state.error = null;
    },
    addActivity: (state, action) => {
      state.activities.unshift(action.payload);
      if (state.recentActivities.length > 0) {
        state.recentActivities.unshift(action.payload);
        state.recentActivities = state.recentActivities.slice(0, 10); // Keep only 10 recent activities
      }
    },
    updateActivity: (state, action) => {
      const index = state.activities.findIndex(activity => activity.id === action.payload.id);
      if (index !== -1) {
        state.activities[index] = action.payload;
      }
      // Update in recent activities if present
      const recentIndex = state.recentActivities.findIndex(activity => activity.id === action.payload.id);
      if (recentIndex !== -1) {
        state.recentActivities[recentIndex] = action.payload;
      }
    },
    deleteActivity: (state, action) => {
      state.activities = state.activities.filter(activity => activity.id !== action.payload);
      state.recentActivities = state.recentActivities.filter(activity => activity.id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const {
  setActivities,
  setRecentActivities,
  setCurrentActivity,
  addActivity,
  updateActivity,
  deleteActivity,
  setFilters,
  setLoading,
  setError
} = activitySlice.actions;

// Selectors
export const selectAllActivities = (state) => state.activities.activities;
export const selectRecentActivities = (state) => state.activities.recentActivities;
export const selectCurrentActivity = (state) => state.activities.currentActivity;
export const selectActivityById = (state, activityId) =>
  state.activities.activities.find(activity => activity.id === activityId);
export const selectActivityFilters = (state) => state.activities.filters;
export const selectIsActivityLoading = (state) => state.activities.isLoading;
export const selectActivityError = (state) => state.activities.error;

// Memoized selector for filtered activities
export const selectFilteredActivities = (state) => {
  const { activities, filters } = state.activities;
  let filtered = [...activities];

  // Apply type filter
  if (filters.type !== 'all') {
    filtered = filtered.filter(activity => activity.type === filters.type);
  }

  // Apply date range filter
  const now = new Date();
  switch (filters.dateRange) {
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(activity => new Date(activity.date) >= weekAgo);
      break;
    case 'month':
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filtered = filtered.filter(activity => new Date(activity.date) >= monthAgo);
      break;
    case 'year':
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      filtered = filtered.filter(activity => new Date(activity.date) >= yearAgo);
      break;
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'date':
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'distance':
      filtered.sort((a, b) => b.distance - a.distance);
      break;
  }

  return filtered;
};

export default activitySlice.reducer; 