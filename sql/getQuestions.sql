create procedure getquestions()
begin
with q_x_r as (
    select
    q.q_id as q_id,
    q.q as q,
    q.img as img,
    group_concat(r.r_id order by `r_order` separator ',') as r_ids,
    group_concat(r.r order by `r_order` separator ',') as rs,
    q.c_id as c_id,
    c.span as span
    from
    questions q
    join
    cycles c on c.c_id = q.c_id
    join
    rights r on r.q_id = q.q_id
    where q.next_question_at < current_timestamp()
    group by q.q_id
),
q_x_t as (
    select
    q.q_id as q_id,
    group_concat(t.t_id order by t.`t_id` separator ',') as t_ids,
    group_concat(t.name order by t.`t_id` separator ',') as t_names
    from
    questions q
    join
    q_to_t qt on qt.q_id = q.q_id
    join
    tags t on t.t_id = qt.t_id
    where q.next_question_at < current_timestamp()
    group by q_id
)
select
q_x_r.q_id as q_id,
q_x_r.q as q,
q_x_r.img as img,
q_x_r.c_id as c_id,
q_x_r.span as span,
q_x_r.r_ids as r_ids,
q_x_r.rs as rs,
q_x_t.t_ids as t_ids,
q_x_t.t_names as t_names
from
q_x_r
join
q_x_t on q_x_r.q_id = q_x_t.q_id;
end$$