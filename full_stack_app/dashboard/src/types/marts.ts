// Dashboard Metrics Types
export interface DashboardMetric {
  metric_date: string;
  branch_id: number;
  customer_id: number;
  total_sales: number;
  total_customers: number;
  sales_growth_pct: number | null;
  customer_growth_pct: number | null;
}

// Recent Transactions Types
export interface TransactionItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface RecentTransaction {
  order_id: number;
  order_date: string;
  order_total: number;
  customer_id: number;
  customer_name: string;
  items: TransactionItem[];
}

// Product Analytics Types
export interface ProductAnalytics {
  branch_id: number;
  customer_id: number;
  product_id: number;
  product_name: string;
  total_quantity_sold: number;
  total_revenue: number;
  total_profit: number;
  number_of_orders: number;
  common_bundles: {
    bundle_id: string;
    products: string[];
    total_sales: number;
  }[];
}

// Sales Trends Types
export interface SalesTrend {
  date_bucket: string;
  time_range: string;
  branch_id: number;
  branch_name: string;
  customer_id: number;
  revenue: number;
  orders: number;
  customers: number;
  visitors: number | null;
  profit: number;
}