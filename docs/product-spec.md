# Doreish – Product Spec (Draft)

## 1) Vision
A unified autonomous AI ops layer that runs every aspect of your SaaS portfolio. Agents are employees, themed as Avengers, each owning a business function.

## 2) Core Modules
1. **Command Center** (HQ dashboard)
2. **Agent Registry** (roles, permissions, tools, KPIs)
3. **Workflow Orchestrator** (event → plan → execute → verify)
4. **SaaS Connectors** (GitHub, Vercel, Linear, Zendesk, Gmail, Slack, Stripe, etc.)
5. **Knowledge Vault** (docs, SOPs, brand guidelines, codebase context)
6. **Observability** (runs, costs, accuracy, approvals)

## 3) Avengers‑Themed Agents (v1)
- **Ironman (CTO)** – architecture, PRs, deploys, infra
- **Hulk (QA/Debug)** – reproduce bugs, tests, fixes
- **Black Widow (Support)** – tickets, replies, escalations
- **Captain America (Ops)** – SOPs, compliance, SLAs
- **Thor (Growth/Marketing)** – campaigns, content, ads
- **Hawkeye (Social)** – posting, moderation, inbox triage
- **Vision (Analytics)** – dashboards, cohort/retention analysis
- **Spider‑Man (Retention/Sales)** – churn saves, win‑backs, upsell
- **Doctor Strange (Automation)** – workflow design + connectors

## 4) MVP Scope (4–6 weeks)
- Command Center dashboard
- 6 agents (Ironman, Hulk, Black Widow, Thor, Vision, Doctor Strange)
- 8 connectors: GitHub, Vercel, Gmail, Slack, Stripe, PostHog, Notion, Linear
- Approvals & audit trail
- Cost control: budget caps, caching, distillation

## 5) User Flows
- **Incident → Fix → Deploy**: alert → Ironman + Hulk → PR → tests → deploy → report
- **Support → Resolution**: ticket → Black Widow → draft reply → approval → send
- **Campaign Launch**: brief → Thor → assets + copy → schedule → report

## 6) Pricing (internal)
Not public. Controlled by usage + budget guardrails.

## 7) Non‑Goals (v1)
- Fully autonomous deploys without approval for prod
- Direct financial transactions without approval

## 8) OpenAI Cost Controls
- Default small/medium models for routine tasks
- Routing: cheap model first, escalate only when needed
- Summarize long threads before reasoning
- Cache embeddings + tool results

## 9) Data Model (high‑level)
- **App**: name, domain, repo, stack, envs
- **Agent**: role, tools, permissions, KPIs
- **Run**: prompt, tools, outputs, cost
- **Task**: type, status, approvals
- **Connector**: provider, auth, scopes

## 10) Security
- Role‑based access, encrypted secrets, audit logs
- Human‑in‑the‑loop for risky actions
