create procedure addQuestion(
in new_q varchar(255),
inout new_q_id int
)
add_question: begin
if not @@in_transaction then
    set new_q_id=0;
    leave add_question;
end if;
insert into questions (q_id,q) values (null,new_q);
set new_q_id=last_insert_id();
update questions set next_question_at=date_add(created_at,interval 10 minute) where q_id=new_q_id;