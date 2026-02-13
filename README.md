# Doreish
Autonomous, Avengers‑themed AI agent ops layer for all your SaaS products.

## Goals
- Single control plane for all SaaS apps (dev, support, marketing, sales, retention, ops)
- Agents as employees (Avengers naming convention)
- Cost‑effective OpenAI usage
- Vercel‑hosted

## Stack (proposed)
- Web: Next.js (App Router) + Tailwind + shadcn/ui
- API: Next.js Route Handlers + Background workers
- DB: Postgres (Neon/Supabase)
- Queue: Upstash Redis + QStash
- Auth: Clerk or NextAuth
- Vector: pgvector (Postgres)
- Storage: S3‑compatible (R2)
- Observability: PostHog + Sentry

## Runbooks
See docs/ for specs, agents, and workflows.
