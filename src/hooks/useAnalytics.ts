import { useState, useEffect, useCallback } from 'react';
import { getAnalyticsSummary, getAllEvaluations } from '@/database/analytics/queries';
import type { AnalyticsSummary, EvaluationData } from '@/database/analytics/types';

interface UseAnalyticsReturn {
  analyticsData: AnalyticsSummary | null;
  evaluationsData: EvaluationData[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [evaluationsData, setEvaluationsData] = useState<EvaluationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [summary, evaluations] = await Promise.all([
        getAnalyticsSummary(),
        getAllEvaluations()
      ]);
      
      setAnalyticsData(summary);
      setEvaluationsData(evaluations);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    analyticsData,
    evaluationsData,
    loading,
    error,
    refreshData,
  };
};
