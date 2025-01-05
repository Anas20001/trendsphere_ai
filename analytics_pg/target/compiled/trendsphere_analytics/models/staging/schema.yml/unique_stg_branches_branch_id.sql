
    
    

select
    branch_id as unique_field,
    count(*) as n_records

from "postgres"."public_staging"."stg_branches"
where branch_id is not null
group by branch_id
having count(*) > 1


