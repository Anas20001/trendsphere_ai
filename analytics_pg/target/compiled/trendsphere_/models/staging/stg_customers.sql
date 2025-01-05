with source as (
    select * from "postgres"."public"."customers"
),

staged as (
    select
        id as customer_id,
        business_id,
        name as customer_name,
        created_at,
        last_visit,
        md5(cast(coalesce(cast(id as TEXT), '_dbt_utils_surrogate_key_null_') as TEXT)) as customer_sk
    from source
)

select * from staged