WITH daily_sales AS (
    SELECT
        DATE_TRUNC('day', o.created_at) AS sale_date,
        b.business_id,
        b.id AS branch_id,
        COUNT(DISTINCT o.id) AS total_orders,
        COUNT(DISTINCT o.customer_id) AS unique_customers,
        SUM(o.total_amount) AS gross_sales,
        SUM(o.discount_amount) AS total_discounts,
        SUM(o.tax_amount) AS total_tax,
        SUM(o.total_amount - o.discount_amount) AS net_sales
    FROM {{ ref('orders') }} o
    JOIN {{ ref('branches') }} b ON o.branch_id = b.id
    WHERE o.status = 'completed'
    GROUP BY 1, 2, 3
)

SELECT
    *,
    LAG(gross_sales) OVER (PARTITION BY branch_id ORDER BY sale_date) AS prev_day_sales,
    (gross_sales - LAG(gross_sales) OVER (PARTITION BY branch_id ORDER BY sale_date)) / 
        NULLIF(LAG(gross_sales) OVER (PARTITION BY branch_id ORDER BY sale_date), 0) * 100 AS sales_growth_pct
FROM daily_sales