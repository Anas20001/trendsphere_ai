with order_items as (
    select * from {{ ref('stg_order_items') }}
),

product_pairs as (
    select
        a.order_id,
        a.product_id as product_1,
        b.product_id as product_2,
        count(*) as times_bought_together
    from order_items a
    join order_items b 
        on a.order_id = b.order_id 
        and a.product_id < b.product_id
    group by 1, 2, 3
),

bundle_metrics as (
    select
        product_1,
        product_2,
        sum(times_bought_together) as total_bundled,
        count(distinct order_id) as bundle_orders
    from product_pairs
    group by 1, 2
)

select * from bundle_metrics 