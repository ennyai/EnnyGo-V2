import { describe, test, expect } from 'vitest';
import activityReducer, {
  setActivities,
  setRecentActivities,
  setCurrentActivity,
  addActivity,
  updateActivity,
  deleteActivity,
  setFilters,
  setLoading,
  setError
} from '../activitySlice';

describe('activity slice', () => {
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

  test('should handle initial state', () => {
    expect(activityReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle setActivities', () => {
    const activities = [{ id: 1, name: 'Morning Run' }];
    const actual = activityReducer(initialState, setActivities(activities));
    expect(actual.activities).toEqual(activities);
  });

  test('should handle setRecentActivities', () => {
    const recentActivities = [{ id: 1, name: 'Morning Run' }];
    const actual = activityReducer(initialState, setRecentActivities(recentActivities));
    expect(actual.recentActivities).toEqual(recentActivities);
  });

  test('should handle setCurrentActivity', () => {
    const activity = { id: 1, name: 'Morning Run' };
    const actual = activityReducer(initialState, setCurrentActivity(activity));
    expect(actual.currentActivity).toEqual(activity);
  });

  test('should handle addActivity', () => {
    const newActivity = { id: 1, name: 'Morning Run' };
    const state = {
      ...initialState,
      activities: [],
      recentActivities: [{ id: 2, name: 'Evening Run' }]
    };
    const actual = activityReducer(state, addActivity(newActivity));
    
    expect(actual.activities).toHaveLength(1);
    expect(actual.activities[0]).toEqual(newActivity);
    expect(actual.recentActivities).toHaveLength(2);
    expect(actual.recentActivities[0]).toEqual(newActivity);
  });

  test('should handle updateActivity', () => {
    const state = {
      ...initialState,
      activities: [{ id: 1, name: 'Morning Run' }],
      recentActivities: [{ id: 1, name: 'Morning Run' }]
    };
    const updatedActivity = { id: 1, name: 'Updated Run' };
    const actual = activityReducer(state, updateActivity(updatedActivity));
    
    expect(actual.activities[0]).toEqual(updatedActivity);
    expect(actual.recentActivities[0]).toEqual(updatedActivity);
  });

  test('should handle deleteActivity', () => {
    const initialActivities = [{ id: 1, name: 'Morning Run' }];
    const state = {
      ...initialState,
      activities: initialActivities,
      recentActivities: initialActivities
    };
    const actual = activityReducer(state, deleteActivity(1));
    
    expect(actual.activities).toHaveLength(0);
    expect(actual.recentActivities).toHaveLength(0);
  });

  test('should handle setFilters', () => {
    const newFilters = {
      type: 'run',
      dateRange: 'month',
      sortBy: 'name'
    };
    const actual = activityReducer(initialState, setFilters(newFilters));
    expect(actual.filters).toEqual(newFilters);
  });

  test('should handle setLoading', () => {
    const actual = activityReducer(initialState, setLoading(true));
    expect(actual.isLoading).toBe(true);
  });

  test('should handle setError', () => {
    const error = 'Failed to fetch activities';
    const actual = activityReducer(initialState, setError(error));
    expect(actual.error).toBe(error);
    expect(actual.isLoading).toBe(false);
  });
}); 