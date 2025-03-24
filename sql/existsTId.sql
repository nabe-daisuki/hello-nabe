create procedure existsTId(
in target_t_id int,
out result bool
)
begin
declare row_count int;
select count(*) into row_count from tags where t_id=target_t_id;
if row_count then
    set result=true;
else
    set result=false;
end if;
end$$