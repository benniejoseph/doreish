# Doreish DB

## Apply migrations
Cloud SQL is private; use Cloud SQL Proxy.

1) Start proxy (from local):
```
./cloud-sql-proxy doreish-ops-6c3f:us-central1:doreish-postgres
```
2) In another terminal:
```
psql "postgres://doreish_app:<password>@localhost:5432/doreish" -f apps/api/migrations/001_init.sql
```

## Tables
- apps
- agents
- tasks
- runs
- connectors
