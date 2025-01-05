import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { DashboardMetric } from '../../types/marts';

export function useMetrics(
  branchId: number,
  options?: Omit<UseQueryOptions<DashboardMetric, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<DashboardMetric, Error>({
    queryKey: ['metrics', branchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marts.fct_dashboard_metrics')
        .select('*')
        .eq('branch_id', branchId)
        .order('metric_date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    ...options,
  });
}