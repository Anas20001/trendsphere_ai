with order_items as (
    select * from "postgres"."public_staging"."stg_order_items"
),

products as (
    select * from "postgres"."public_staging"."stg_products"
),

product_metrics as (
    select
        p.branch_id,
        oi.product_id,
        p.product_name,
        p.price,
        sum(oi.quantity) as total_quantity_sold,
        sum(oi.item_total) as total_revenue,
        count(distinct oi.order_id) as number_of_orders
    from order_items oi
    join products p on oi.product_id = p.product_id
    group by 1, 2, 3, 4
)

select * from product_metrics