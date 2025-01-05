
  
    

  create  table "postgres"."public_marts"."fct_recent_transactions__dbt_tmp"
  
  
    as
  
  (
    with orders as (
    select * from "postgres"."public_staging"."stg_orders"
),

order_items as (
    select * from "postgres"."public_staging"."stg_order_items"
),

products as (
    select * from "postgres"."public_staging"."stg_products"
),

customers as (
    select * from "postgres"."public_staging"."stg_customers"
),

order_details as (
    select
        o.order_id,
        o.order_date,
        o.order_total,
        c.customer_id,
        c.customer_name,
        json_agg(
            json_build_object(
                'name', p.product_name,
                'quantity', oi.quantity,
                'price', p.price
            )
        ) as items
    from orders o
    join customers c on o.customer_id = c.customer_id
    join order_items oi on o.order_id = oi.order_id
    join products p on oi.product_id = p.product_id
    group by 1, 2, 3, 4, 5
)

select * from order_details
where order_date >= current_timestamp - interval '24 hours'
order by order_date desc
limit 50
  );
  