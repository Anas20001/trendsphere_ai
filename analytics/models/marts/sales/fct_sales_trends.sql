WITH daily_metrics AS (
    SELECT
        business_date as date_bucket,
        'daily' as time_range,
        branch_id,
        branch_name,
        customer_id,
        total_revenue as revenue,
        total_orders as orders,
        unique_customers as customers,
        total_visitors as visitors,
        total_profit as profit
    FROM {{ ref('int_daily_branch_metrics') }}
    WHERE business_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
),

weekly_metrics AS (
    SELECT
        DATE_TRUNC('week', business_date) as date_bucket,
        'weekly' as time_range,
        branch_id,
        branch_name,
        customer_id,
        SUM(total_revenue) as revenue,
        SUM(total_orders) as orders,
        COUNT(DISTINCT unique_customers) as customers,
        SUM(total_visitors) as visitors,
        SUM(total_profit) as profit
    FROM {{ ref('int_daily_branch_metrics') }}
    WHERE business_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
    GROUP BY 1, 2, 3, 4, 5
),

monthly_metrics AS (
    SELECT
        DATE_TRUNC('month', business_date) as date_bucket,
        'monthly' as time_range,
        branch_id,
        branch_name,
        customer_id,
        SUM(total_revenue) as revenue,
        SUM(total_orders) as orders,
        COUNT(DISTINCT unique_customers) as customers,
        SUM(total_visitors) as visitors,
        SUM(total_profit) as profit
    FROM {{ ref('int_daily_branch_metrics') }}
    WHERE business_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    GROUP BY 1, 2, 3, 4, 5
),

yearly_metrics AS (
    SELECT
        DATE_TRUNC('year', business_date) as date_bucket,
        'yearly' as time_range,
        branch_id,
        branch_name,
        customer_id,
        SUM(total_revenue) as revenue,
        SUM(total_orders) as orders,
        COUNT(DISTINCT unique_customers) as customers,
        SUM(total_visitors) as visitors,
        SUM(total_profit) as profit
    FROM {{ ref('int_daily_branch_metrics') }}
    WHERE business_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
    GROUP BY 1, 2, 3, 4, 5
)

SELECT * FROM daily_metrics
UNION ALL SELECT * FROM weekly_metrics
UNION ALL SELECT * FROM monthly_metrics
UNION ALL SELECT * FROM yearly_metrics
ORDER BY branch_id, time_range, date_bucket