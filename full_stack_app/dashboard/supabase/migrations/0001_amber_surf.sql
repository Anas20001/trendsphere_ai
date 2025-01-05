/*
  # Create Schemas and Optimize Dashboard Tables

  1. Create Schemas
    - Create marts schema for dashboard data
  
  2. Create Tables
    - Create required mart tables
  
  3. Add Indexes
    - Optimize query performance
  
  4. Security
    - Enable RLS
    - Add access policies
*/

-- Create marts schema
CREATE SCHEMA IF NOT EXISTS marts;

-- Create dashboard metrics table
CREATE TABLE IF NOT EXISTS marts.fct_dashboard_metrics (
    metric_date DATE NOT NULL,
    branch_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    total_sales NUMERIC(15,2) NOT NULL,
    total_customers INT NOT NULL,
    sales_growth_pct NUMERIC(5,2),
    customer_growth_pct NUMERIC(5,2),
    PRIMARY KEY (metric_date, branch_id)
);

-- Create recent transactions table
CREATE TABLE IF NOT EXISTS marts.fct_recent_transactions (
    order_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_date TIMESTAMPTZ NOT NULL,
    order_total NUMERIC(10,2) NOT NULL,
    customer_id BIGINT NOT NULL,
    customer_name TEXT,
    items JSONB
);

-- Create product analytics table
CREATE TABLE IF NOT EXISTS marts.fct_product_analytics (
    branch_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name TEXT NOT NULL,
    total_quantity_sold INT NOT NULL,
    total_revenue NUMERIC(15,2) NOT NULL,
    total_profit NUMERIC(15,2) NOT NULL,
    number_of_orders INT NOT NULL,
    common_bundles JSONB,
    PRIMARY KEY (branch_id, product_id)
);

-- Create sales trends table
CREATE TABLE IF NOT EXISTS marts.fct_sales_trends (
    date_bucket DATE NOT NULL,
    time_range TEXT NOT NULL,
    branch_id BIGINT NOT NULL,
    branch_name TEXT NOT NULL,
    customer_id BIGINT NOT NULL,
    revenue NUMERIC(15,2) NOT NULL,
    orders INT NOT NULL,
    customers INT NOT NULL,
    visitors INT,
    profit NUMERIC(15,2) NOT NULL,
    PRIMARY KEY (date_bucket, time_range, branch_id)
);

-- Create indexes for optimization
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_date_branch 
ON marts.fct_dashboard_metrics(metric_date DESC, branch_id);

CREATE INDEX IF NOT EXISTS idx_recent_transactions_date 
ON marts.fct_recent_transactions(order_date DESC);

CREATE INDEX IF NOT EXISTS idx_product_analytics_revenue 
ON marts.fct_product_analytics(total_revenue DESC);

CREATE INDEX IF NOT EXISTS idx_sales_trends_date_range 
ON marts.fct_sales_trends(date_bucket, time_range);

-- Enable RLS
ALTER TABLE marts.fct_dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE marts.fct_recent_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marts.fct_product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE marts.fct_sales_trends ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Allow authenticated users to read dashboard metrics"
ON marts.fct_dashboard_metrics FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to read recent transactions"
ON marts.fct_recent_transactions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to read product analytics"
ON marts.fct_product_analytics FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to read sales trends"
ON marts.fct_sales_trends FOR SELECT
TO authenticated
USING (true);