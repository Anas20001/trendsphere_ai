WITH daily_metrics AS (
    SELECT 
        s.branch_id,
        d.business_date,
        COUNT(DISTINCT s.order_id) as total_orders,
        COUNT(DISTINCT s.customer_id) as unique_customers,
        SUM(s.net_with_tax) as total_revenue,
        SUM(s.profit) as total_profit,
        AVG(s.net_with_tax) as avg_order_value,
        SUM(s.net_quantity) as items_sold
    FROM {{ ref('stg_sales') }} s
    JOIN dates d ON s.date_id = d.id
    GROUP BY s.branch_id, d.business_date
),

branch_trends AS (
    SELECT 
        branch_id,
        business_date,
        total_orders,
        unique_customers,
        total_revenue,
        total_profit,
        avg_order_value,
        items_sold,
        AVG(total_revenue) OVER (
            PARTITION BY branch_id 
            ORDER BY business_date 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) as revenue_7day_avg,
        LAG(total_revenue) OVER (
            PARTITION BY branch_id 
            ORDER BY business_date
        ) as prev_day_revenue
    FROM daily_metrics
)

SELECT 
    bt.*,
    ROUND(((total_revenue - prev_day_revenue) / NULLIF(prev_day_revenue, 0)) * 100, 2) as revenue_growth_pct
FROM branch_trends bt 