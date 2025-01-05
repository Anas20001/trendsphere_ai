
  
    

  create  table "postgres"."public_marts"."dim_customer_segments__dbt_tmp"
  
  
    as
  
  (
    with customer_value as (
    select * from "postgres"."public"."int_customer_lifetime_value"
),

segments as (
    select
        customer_id,
        total_spent,
        total_orders,
        monthly_value,
        days_since_last_purchase,
        case 
            when total_spent >= (select percentile_cont(0.9) within group (order by total_spent) from customer_value)
                then 'VIP'
            when total_spent >= (select percentile_cont(0.7) within group (order by total_spent) from customer_value)
                then 'Regular'
            when days_since_last_purchase <= 30
                then 'Active'
            when days_since_last_purchase <= 90
                then 'At Risk'
            else 'Churned'
        end as segment
    from customer_value
)

select * from segments
  );
  