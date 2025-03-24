create procedure addTag(
in new_t_name varchar(30),
out new_t_id int
)
add_tag: begin

if not @@in_transaction then
    set new_t_id=0;
    leave add_tag;
end if;

insert into tags (t_id,name) values (null,new_t_name);
set new_t_id=last_insert_id();
end$$