WITH daily_metrics AS (
    SELECT * FROM {{ ref('int_daily_branch_metrics') }}
),

branch_trends AS (
    SELECT
        *,
        -- 7-day rolling metrics
        AVG(total_revenue) OVER (
            PARTITION BY branch_id 
            ORDER BY business_date 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) as revenue_7day_avg,
        AVG(total_orders) OVER (
            PARTITION BY branch_id 
            ORDER BY business_date 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) as orders_7day_avg,
        
        -- Previous day metrics for growth calc
        LAG(total_revenue) OVER (
            PARTITION BY branch_id ORDER BY business_date
        ) as prev_day_revenue,
        LAG(total_orders) OVER (
            PARTITION BY branch_id ORDER BY business_date
        ) as prev_day_orders,
        LAG(unique_customers) OVER (
            PARTITION BY branch_id ORDER BY business_date
        ) as prev_day_customers
    FROM daily_metrics
)

SELECT 
    *,
    -- Growth calculations
    ROUND(((total_revenue - prev_day_revenue) / NULLIF(prev_day_revenue, 0)) * 100, 2) 
        as revenue_growth_pct,
    ROUND(((total_orders - prev_day_orders) / NULLIF(prev_day_orders, 0)) * 100, 2) 
        as orders_growth_pct,
    ROUND(((unique_customers - prev_day_customers) / NULLIF(prev_day_customers, 0)) * 100, 2) 
        as customer_growth_pct,
    -- Efficiency metrics
    ROUND(total_revenue / NULLIF(total_visitors, 0), 2) as revenue_per_visitor,
    ROUND(total_orders / NULLIF(unique_customers, 0), 2) as orders_per_customer
FROM branch_trends 