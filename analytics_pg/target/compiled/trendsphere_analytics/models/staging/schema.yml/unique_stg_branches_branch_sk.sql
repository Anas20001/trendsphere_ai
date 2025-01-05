
    
    

select
    branch_sk as unique_field,
    count(*) as n_records

from "postgres"."public_staging"."stg_branches"
where branch_sk is not null
group by branch_sk
having count(*) > 1


