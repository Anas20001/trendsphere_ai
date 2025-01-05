WITH daily_metrics AS (
    SELECT * FROM {{ ref('int_daily_branch_metrics') }}
),

prev_day_metrics AS (
    SELECT
        branch_id,
        customer_id,
        business_date as date,
        total_revenue,
        total_profit,
        unique_customers,
        total_visitors,
        total_items_sold,
        total_returns,
        total_cancellations,
        LAG(total_revenue) OVER (PARTITION BY branch_id, customer_id ORDER BY business_date) as prev_day_revenue,
        LAG(total_profit) OVER (PARTITION BY branch_id, customer_id ORDER BY business_date) as prev_day_profit,
        LAG(unique_customers) OVER (PARTITION BY branch_id, customer_id ORDER BY business_date) as prev_day_customers,
        LAG(total_visitors) OVER (PARTITION BY branch_id, customer_id ORDER BY business_date) as prev_day_visitors
    FROM daily_metrics
)

SELECT
    CURRENT_DATE() as metric_date,
    dm.branch_id,
    dm.customer_id,
    -- Revenue metrics
    COALESCE(SUM(dm.total_revenue), 0) as total_sales,
    COALESCE(SUM(dm.total_profit), 0) as total_profit,
    COALESCE(SUM(dm.total_returns), 0) as total_returns,
    COALESCE(SUM(dm.total_cancellations), 0) as total_cancellations,
    -- Customer metrics
    COALESCE(SUM(dm.unique_customers), 0) as total_customers,
    COALESCE(SUM(dm.total_visitors), 0) as total_visitors,
    COALESCE(SUM(dm.total_items_sold), 0) as total_items,
    -- Growth metrics
    COALESCE(ROUND(
        ((SUM(dm.total_revenue) - SUM(pdm.prev_day_revenue)) / NULLIF(SUM(pdm.prev_day_revenue), 0) * 100), 
        2
    ), 0) as sales_growth_pct,
    COALESCE(ROUND(
        ((SUM(dm.total_profit) - SUM(pdm.prev_day_profit)) / NULLIF(SUM(pdm.prev_day_profit), 0) * 100),
        2
    ), 0) as profit_growth_pct,
    COALESCE(ROUND(
        ((SUM(dm.unique_customers) - SUM(pdm.prev_day_customers)) / NULLIF(SUM(pdm.prev_day_customers), 0) * 100),
        2
    ), 0) as customer_growth_pct,
    COALESCE(ROUND(
        ((SUM(dm.total_visitors) - SUM(pdm.prev_day_visitors)) / NULLIF(SUM(pdm.prev_day_visitors), 0) * 100),
        2
    ), 0) as visitor_growth_pct
FROM daily_metrics dm
LEFT JOIN prev_day_metrics pdm 
    ON dm.branch_id = pdm.branch_id 
    AND dm.customer_id = pdm.customer_id
    AND dm.business_date = pdm.date
WHERE dm.business_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
GROUP BY 1, 2, 3