import { describe, test, expect } from 'vitest';
import activityReducer, {
  fetchActivitiesStart,
  fetchActivitiesSuccess,
  fetchActivitiesError,
  setPage,
  resetActivities
} from '../activitySlice';

describe('activity slice', () => {
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

  test('should handle initial state', () => {
    expect(activityReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle fetchActivitiesStart', () => {
    const actual = activityReducer(initialState, fetchActivitiesStart());
    expect(actual.isLoading).toBe(true);
    expect(actual.error).toBe(null);
  });

  test('should handle fetchActivitiesSuccess for first page', () => {
    const activities = [{ id: 1, name: 'Morning Run' }];
    const state = {
      ...initialState,
      isLoading: true
    };
    const actual = activityReducer(state, fetchActivitiesSuccess(activities));
    expect(actual.activities).toEqual(activities);
    expect(actual.isLoading).toBe(false);
    expect(actual.pagination.hasMore).toBe(false);
  });

  test('should handle fetchActivitiesSuccess for subsequent pages', () => {
    const existingActivities = [{ id: 1, name: 'Morning Run' }];
    const newActivities = [{ id: 2, name: 'Evening Run' }];
    const state = {
      ...initialState,
      activities: existingActivities,
      pagination: {
        ...initialState.pagination,
        page: 2
      },
      isLoading: true
    };
    const actual = activityReducer(state, fetchActivitiesSuccess(newActivities));
    expect(actual.activities).toEqual([...existingActivities, ...newActivities]);
    expect(actual.isLoading).toBe(false);
    expect(actual.pagination.hasMore).toBe(false);
  });

  test('should handle fetchActivitiesError', () => {
    const error = 'Failed to fetch activities';
    const state = {
      ...initialState,
      isLoading: true
    };
    const actual = activityReducer(state, fetchActivitiesError(error));
    expect(actual.error).toBe(error);
    expect(actual.isLoading).toBe(false);
  });

  test('should handle setPage', () => {
    const newPage = 2;
    const actual = activityReducer(initialState, setPage(newPage));
    expect(actual.pagination.page).toBe(newPage);
  });

  test('should handle resetActivities', () => {
    const state = {
      activities: [{ id: 1, name: 'Morning Run' }],
      isLoading: true,
      error: 'Some error',
      pagination: {
        page: 2,
        per_page: 50,
        hasMore: false
      }
    };
    const actual = activityReducer(state, resetActivities());
    expect(actual).toEqual(initialState);
  });
}); 