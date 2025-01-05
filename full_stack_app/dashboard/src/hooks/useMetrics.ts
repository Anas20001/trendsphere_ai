import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useMetrics(branchId: string) {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const { data, error } = await supabase
          .from('marts.fct_dashboard_metrics')
          .select('*')
          .eq('branch_id', branchId)
          .order('metric_date', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [branchId]);

  return { metrics, loading, error };
}