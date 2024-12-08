WITH bundle_analysis AS (
    SELECT 
        pb.user_id,
        pb.branch_id,
        pb.bundle_1,
        pb.bundle_2,
        pb.analysis_description,
        pb.confidence_score,
        pf.pair_frequency,
        pf.pair_percentage
    FROM {{ ref('product_bundle_insights') }} pb
    LEFT JOIN {{ ref('product_pairs_frequency') }} pf 
        ON (pb.bundle_1 = pf.product_1 AND pb.bundle_2 = pf.product_2)
        OR (pb.bundle_1 = pf.product_2 AND pb.bundle_2 = pf.product_1)
)

SELECT * FROM bundle_analysis 