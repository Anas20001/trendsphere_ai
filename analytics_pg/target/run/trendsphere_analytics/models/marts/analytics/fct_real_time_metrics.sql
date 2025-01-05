
  
    

  create  table "postgres"."public_marts"."fct_real_time_metrics__dbt_tmp"
  
  
    as
  
  (
    with recent_orders as (
    select * 
    from "postgres"."public_staging"."stg_orders"
    where order_date >= now() - interval '24 hours'
),

hourly_metrics as (
    select
        branch_id,
        date_trunc('hour', order_date) as hour,
        count(*) as orders_count,
        sum(order_total) as revenue,
        count(distinct customer_id) as unique_customers
    from recent_orders
    group by 1, 2
)

select * from hourly_metrics
  );
  