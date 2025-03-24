create procedure existsQId(
in target_q_id int,
out result bool
)
begin
declare row_count int;
select count(*) into row_count from questions where q_id = target_q_id;
if row_count then
    set result=true;
else
    set result=false;
end if;
end$$