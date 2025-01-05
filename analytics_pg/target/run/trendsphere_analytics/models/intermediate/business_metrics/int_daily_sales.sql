
  create view "postgres"."public"."int_daily_sales__dbt_tmp"
    
    
  as (
    with orders as (
    select * from "postgres"."public_staging"."stg_orders"
),

daily_metrics as (
    select
        branch_id,
        date_trunc('day', order_date) as date,
        count(distinct order_id) as num_orders,
        count(distinct customer_id) as num_customers,
        sum(order_total) as total_sales,
        avg(order_total) as avg_order_value
    from orders
    group by 1, 2
)

select * from daily_metrics
  );