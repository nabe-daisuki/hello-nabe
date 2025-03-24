create procedure addQToT(
in target_q_id int,
in target_t_id int,
out result bool
)
add_q_to_t: begin
if not @@in_transaction then
    set result=false;
    leave add_q_to_t;
end if;

declare exists_q_id bool;
declare exists_t_id bool;
call existsQId(target_q_id,exists_q_id);
call existsTId(target_t_id,exists_t_id);
if not exists_q_id or not exists_t_id then
    set result=false;
    leave add_q_to_t;
end if;
insert into q_to_t (q_id,t_id) values (target_q_id,target_t_id);
set result=true;
end$$