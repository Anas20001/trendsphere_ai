import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSalesTrends(branchId: string, timeRange: string) {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrends() {
      try {
        const { data, error } = await supabase
          .from('marts.fct_sales_trends')
          .select('*')
          .eq('branch_id', branchId)
          .eq('time_range', timeRange)
          .order('date_bucket', { ascending: true });

        if (error) throw error;
        setTrends(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchTrends();
  }, [branchId, timeRange]);

  return { trends, loading, error };
}