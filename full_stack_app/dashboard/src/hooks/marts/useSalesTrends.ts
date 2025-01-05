import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { SalesTrend } from '../../types/marts';

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface UseSalesTrendsOptions {
  branchId: number;
  timeRange: TimeRange;
  startDate?: Date;
  endDate?: Date;
}

export function useSalesTrends(
  { branchId, timeRange, startDate, endDate }: UseSalesTrendsOptions,
  options?: Omit<UseQueryOptions<SalesTrend[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<SalesTrend[], Error>({
    queryKey: ['salesTrends', branchId, timeRange, startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('marts.fct_sales_trends')
        .select('*')
        .eq('branch_id', branchId)
        .eq('time_range', timeRange)
        .order('date_bucket', { ascending: true });

      if (startDate) {
        query = query.gte('date_bucket', startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        query = query.lte('date_bucket', endDate.toISOString().split('T')[0]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    ...options,
  });
}