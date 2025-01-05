
  create view "postgres"."public_staging"."stg_orders__dbt_tmp"
    
    
  as (
    with source as (
    select * from "postgres"."public"."orders"
),

staged as (
    select
        id as order_id,
        branch_id,
        customer_id,
        order_total,
        status,
        order_date,
        md5(cast(coalesce(cast(id as TEXT), '_dbt_utils_surrogate_key_null_') as TEXT)) as order_sk
    from source
    where status = 'completed' -- Only include completed orders
)

select * from staged
  );