import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import StravaService from '@/services/strava';
import {
  fetchActivitiesStart,
  fetchActivitiesSuccess,
  fetchActivitiesError,
  setPage,
  resetActivities
} from '@/store/slices/activitySlice';

export const useActivities = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const {
    activities,
    isLoading,
    error,
    pagination: { page, per_page, hasMore }
  } = useSelector((state) => state.activities);

  const fetchActivities = async (isInitialFetch = false) => {
    if (isInitialFetch) {
      dispatch(resetActivities());
    }
    
    try {
      dispatch(fetchActivitiesStart());
      const data = await StravaService.getActivities({ 
        page: isInitialFetch ? 1 : page, 
        per_page 
      });
      dispatch(fetchActivitiesSuccess(data));
    } catch (error) {
      dispatch(fetchActivitiesError(error.message));
      toast({
        title: "Error fetching activities",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      dispatch(setPage(page + 1));
    }
  };

  // Fetch activities when page changes
  useEffect(() => {
    // Only fetch if we're not on page 1 (initial fetch is handled separately)
    if (page > 1 && !isLoading) {
      fetchActivities(false);
    }
  }, [page, isLoading]);

  return {
    activities,
    isLoading,
    error,
    hasMore,
    fetchActivities,
    loadMore
  };
}; 