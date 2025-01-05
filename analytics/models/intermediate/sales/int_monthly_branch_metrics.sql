WITH daily_metrics AS (
    SELECT * FROM {{ ref('int_daily_branch_metrics') }}
)

SELECT
    branch_id,
    customer_id,
    branch_name,
    branch_reference,
    DATE_FORMAT(business_date, '%Y-%m-01') as month,
    -- Order metrics
    SUM(total_orders) as monthly_orders,
    COUNT(DISTINCT unique_customers) as monthly_customers,
    -- Revenue metrics
    SUM(total_revenue) as monthly_revenue,
    SUM(total_profit) as monthly_profit,
    AVG(avg_order_value) as avg_order_value,
    -- Visitor metrics
    SUM(total_visitors) as monthly_visitors,
    AVG(avg_value_per_visitor) as avg_value_per_visitor,
    -- Additional metrics
    SUM(total_items_sold) as monthly_items_sold,
    SUM(total_returns) as monthly_returns,
    SUM(total_cancellations) as monthly_cancellations,
    SUM(total_discounts) as monthly_discounts,
    -- Revenue per customer
    SUM(total_revenue) / NULLIF(COUNT(DISTINCT unique_customers), 0) as revenue_per_customer
FROM daily_metrics
GROUP BY 1, 2, 3, 4, 5