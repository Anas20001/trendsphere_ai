WITH source AS (
    SELECT * FROM {{ source('raw', 'sales') }}
),

staged AS (
    SELECT
        id as sale_id,
        branch_id,
        customer_id,
        date_id,
        order_id,
        total,
        net_with_tax,
        total_excluding_tax,
        net,
        net_quantity,
        cost,
        profit,
        created_at,
        updated_at
    FROM source
)

SELECT * FROM staged 