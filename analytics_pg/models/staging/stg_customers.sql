with source as (
    select * from {{ source('raw', 'customers') }}
),

staged as (
    select
        id as customer_id,
        business_id,
        name as customer_name,
        created_at,
        last_visit,
        {{ dbt_utils.generate_surrogate_key(['id']) }} as customer_sk
    from source
)

select * from staged 