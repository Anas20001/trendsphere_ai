SELECT 
    b.name as branch_name,
    p.product_name,
    COUNT(DISTINCT s.order_id) as total_orders,
    SUM(s.net_with_tax) as total_revenue,
    SUM(s.net_quantity) as total_quantity,
    SUM(s.profit) as total_profit,
    AVG(s.net_with_tax) as avg_order_value,
    DATE_TRUNC('month', d.business_date) as sales_month
FROM {{ ref('stg_sales') }} s
JOIN branches b ON s.branch_id = b.id
JOIN products p ON s.product_id = p.id
JOIN dates d ON s.date_id = d.id
GROUP BY branch_name, product_name, sales_month 