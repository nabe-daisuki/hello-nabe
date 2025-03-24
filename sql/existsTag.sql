create procedure existsTag(
in target_t_name varchar(30),
out result bool
)
begin
declare row_count int;
select count(*) into row_count from tags where name = target_t_name;
if row_count then
    set result=true;
else
    set result=false;
end if;
end$$