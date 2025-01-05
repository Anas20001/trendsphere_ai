import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProductAnalytics(branchId: string) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const { data, error } = await supabase
          .from('marts.fct_product_analytics')
          .select('*')
          .eq('branch_id', branchId)
          .order('total_revenue', { ascending: false })
          .limit(10);

        if (error) throw error;
        setAnalytics(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [branchId]);

  return { analytics, loading, error };
}