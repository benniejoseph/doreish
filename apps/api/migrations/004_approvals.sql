-- Approvals
create table if not exists approvals (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references tasks(id) on delete set null,
  action text not null,
  status text default 'pending',
  requested_by text default 'System',
  approved_by text,
  created_at timestamptz default now(),
  decided_at timestamptz
);
