with source as (
    select * from "postgres"."public"."products"
),

staged as (
    select
        id as product_id,
        branch_id,
        name as product_name,
        price,
        md5(cast(coalesce(cast(id as TEXT), '_dbt_utils_surrogate_key_null_') as TEXT)) as product_sk
    from source
)

select * from staged