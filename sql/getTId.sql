create procedure getTId(
in target_t_name varchar(30),
out t_id int
)
get_tid: begin
declare result bool;
call existsTag(target_t_name,result);

if not result then
    set t_id=0;
    leave get_tid;
end if;

select t.`t_id` into t_id from tags t where name=target_t_name;
end$$