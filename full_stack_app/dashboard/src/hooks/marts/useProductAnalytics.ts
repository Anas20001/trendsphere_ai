import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { ProductAnalytics } from '../../types/marts';

interface UseProductAnalyticsOptions {
  branchId: number;
  sortBy?: 'revenue' | 'quantity' | 'profit';
  limit?: number;
}

export function useProductAnalytics(
  { branchId, sortBy = 'revenue', limit = 10 }: UseProductAnalyticsOptions,
  options?: Omit<UseQueryOptions<ProductAnalytics[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ProductAnalytics[], Error>({
    queryKey: ['productAnalytics', branchId, sortBy, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marts.fct_product_analytics')
        .select('*')
        .eq('branch_id', branchId)
        .order(
          sortBy === 'revenue' 
            ? 'total_revenue' 
            : sortBy === 'quantity' 
              ? 'total_quantity_sold' 
              : 'total_profit',
          { ascending: false }
        )
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    ...options,
  });
}