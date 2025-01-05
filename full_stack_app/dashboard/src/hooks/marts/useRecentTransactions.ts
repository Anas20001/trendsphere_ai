import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { RecentTransaction } from '../../types/marts';

interface UseRecentTransactionsOptions {
  limit?: number;
  filters?: {
    startDate?: Date;
    endDate?: Date;
    customerId?: number;
  };
}

export function useRecentTransactions(
  { limit = 10, filters }: UseRecentTransactionsOptions = {},
  options?: Omit<UseInfiniteQueryOptions<RecentTransaction[], Error>, 'queryKey' | 'queryFn'>
) {
  return useInfiniteQuery<RecentTransaction[], Error>({
    queryKey: ['transactions', limit, filters],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('marts.fct_recent_transactions')
        .select('*')
        .order('order_date', { ascending: false })
        .range(pageParam * limit, (pageParam + 1) * limit - 1);

      if (filters?.startDate) {
        query = query.gte('order_date', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('order_date', filters.endDate.toISOString());
      }
      if (filters?.customerId) {
        query = query.eq('customer_id', filters.customerId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    getNextPageParam: (lastPage, allPages) => 
      lastPage.length === limit ? allPages.length : undefined,
    ...options,
  });
}