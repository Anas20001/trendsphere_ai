# Intermediate Layer Documentation

## Business Metrics

### int_daily_sales
Calculates daily performance metrics by branch.

**Key Metrics:**
- Daily order count
- Unique customer count
- Total sales
- Average order value
- Visitor metrics

**Dependencies:**
- stg_sales
- dates (for business date mapping)

**SQL Transformations:**
```sql
SELECT
    branch_id,
    DATE(business_date) as date,
    COUNT(DISTINCT order_id) as num_orders,
    COUNT(DISTINCT customer_id) as num_customers,
    SUM(net_with_tax) as total_sales,
    AVG(net_with_tax) as avg_order_value,
    SUM(visitors_count) as total_visitors,
    AVG(avg_value_per_visitor) as avg_value_per_visitor
FROM sales
GROUP BY 1, 2
```

### int_branch_performance
Monthly branch performance aggregations.

**Key Metrics:**
- Monthly sales totals
- Order volumes
- Customer counts
- Revenue per customer
- Visitor totals

**Dependencies:**
- int_daily_sales

### int_product_performance
Product-level performance metrics.

**Key Metrics:**
- Quantity sold
- Revenue
- Profit
- Order frequency

**Dependencies:**
- stg_sales
- stg_products 