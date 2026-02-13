# Doreish – Infra Plan (Supabase + Upstash)

## Target Budget
- Keep infra under **$100/mo**

## Services
- **Vercel**: web + API
- **Supabase**: Postgres + Auth + Storage (optional)
- **Upstash Redis**: queues + caching
- **QStash** (optional): scheduled workflows

## Estimated Monthly Cost (MVP)
- Vercel: Free/Pro (start Free)
- Supabase: Free or Pro ($25) if hitting limits
- Upstash: Free/Starter ($10–$20)
- PostHog Cloud: Free tier
- Sentry: Free tier

## Notes
- Keep AI usage controlled with routing + caching
- Use batched jobs to reduce token spend
