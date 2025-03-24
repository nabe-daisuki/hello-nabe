create procedure addRight(
in target_q_id int,
in new_r varchar(255),
out new_r_id int
)
add_right: begin
if not @@in_transaction then
    set new_r_id=0;
    leave add_right;
end if;

declare exists_q_id bool;
call existsQId(target_q_id,exists_q_id);
if not exists_q_id then
    set new_r_id=0;
    leave add_right;
end if;

declare right_count int;
select count(*) into right_count from rights where q_id=target_q_id;
insert into rights (r_id,r,q_id,r_order) values (null,new_r,target_q_id,right_count+1);
set new_r_id=last_insert_id();
end$$