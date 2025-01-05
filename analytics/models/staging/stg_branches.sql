WITH source AS (
    SELECT * FROM {{ source('raw', 'branches') }}
)

SELECT
    id AS branch_id,
    name AS branch_name,
    reference AS branch_reference,
    created_at,
    updated_at
FROM source 