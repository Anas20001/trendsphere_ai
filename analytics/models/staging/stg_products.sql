WITH source AS (
    SELECT * FROM {{ source('raw', 'products') }}
)

SELECT
    id AS product_id,
    identification_code,
    product_name,
    created_at,
    updated_at
FROM source 