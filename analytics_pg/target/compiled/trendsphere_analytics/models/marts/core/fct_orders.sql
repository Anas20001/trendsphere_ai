with orders as (
    select * from "postgres"."public_staging"."stg_orders"
),

order_items as (
    select * from "postgres"."public_staging"."stg_order_items"
),

customers as (
    select * from "postgres"."public_staging"."stg_customers"
),

final as (
    select
        o.order_sk,
        o.order_id,
        o.branch_id,
        o.customer_id,
        c.name as customer_name,
        o.order_date,
        o.order_total,
        count(distinct oi.order_item_id) as num_items,
        sum(oi.quantity) as total_quantity,
        o.status
    from orders o
    left join order_items oi on o.order_id = oi.order_id
    left join customers c on o.customer_id = c.id
    group by 1,2,3,4,5,6,7,10
)

select * from final