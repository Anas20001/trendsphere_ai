import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRecentTransactions(limit = 5) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data, error } = await supabase
          .from('marts.fct_recent_transactions')
          .select('*')
          .order('order_date', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setTransactions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [limit]);

  return { transactions, loading, error };
}