-- Threading support
alter table messages add column if not exists thread_id uuid references messages(id) on delete cascade;
create index if not exists idx_messages_thread on messages (thread_id);
