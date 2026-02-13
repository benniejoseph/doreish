-- Agent communications (War Room)
create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender text not null,
  role text default 'agent',
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_messages_conversation_created
  on messages (conversation_id, created_at desc);
