-- Doreish initial schema
create extension if not exists "uuid-ossp";

create table if not exists apps (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  domain text,
  repo_url text,
  stack jsonb,
  created_at timestamptz default now()
);

create table if not exists agents (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  theme text default 'Avengers',
  skills jsonb default '[]',
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  app_id uuid references apps(id) on delete set null,
  agent_id uuid references agents(id) on delete set null,
  type text not null,
  status text default 'queued',
  priority int default 3,
  input jsonb default '{}',
  output jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists runs (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references tasks(id) on delete cascade,
  model text,
  tokens_in int default 0,
  tokens_out int default 0,
  cost_usd numeric(12,4) default 0,
  status text default 'completed',
  logs jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists connectors (
  id uuid primary key default uuid_generate_v4(),
  app_id uuid references apps(id) on delete cascade,
  provider text not null,
  config jsonb default '{}',
  created_at timestamptz default now()
);
