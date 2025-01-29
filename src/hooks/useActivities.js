import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useSelector } from 'react-redux';

export function useActivities() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { isConnected } = useSelector((state) => state.strava);

  const fetchActivities = useCallback(async (reset = false) => {
    if (!isConnected) {
      setActivities([]);
      setHasMore(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const currentPage = reset ? 1 : page;
      const { data, error: fetchError } = await supabase
        .from('activities')
        .select('*')
        .order('start_date', { ascending: false })
        .range((currentPage - 1) * 10, currentPage * 10 - 1);

      if (fetchError) throw fetchError;

      if (reset) {
        setActivities(data);
      } else {
        setActivities(prev => [...prev, ...data]);
      }

      setHasMore(data.length === 10);
      if (!reset) {
        setPage(prev => prev + 1);
      } else {
        setPage(2);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, page]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchActivities();
    }
  }, [fetchActivities, isLoading, hasMore]);

  return {
    activities,
    isLoading,
    error,
    hasMore,
    fetchActivities,
    loadMore
  };
} 