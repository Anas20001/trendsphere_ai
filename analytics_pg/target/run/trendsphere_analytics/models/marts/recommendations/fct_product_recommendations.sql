
  
    

  create  table "postgres"."public_marts"."fct_product_recommendations__dbt_tmp"
  
  
    as
  
  (
    with product_performance as (
    select * from "postgres"."public"."int_product_performance"
),

product_bundles as (
    select * from "postgres"."public_marts"."fct_product_bundles"
),

recommendations as (
    select
        pp.branch_id,
        pp.product_id,
        pp.product_name,
        pp.total_revenue,
        pp.total_quantity_sold,
        array_agg(pb.product_2 order by pb.total_bundled desc) 
            filter (where pb.product_2 is not null)
            as recommended_pairs
    from product_performance pp
    left join product_bundles pb on pp.product_id = pb.product_1
    group by 1, 2, 3, 4, 5
)

select * from recommendations
  );
  