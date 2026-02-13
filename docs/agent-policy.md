# Doreish – Agent Policy Spec

## 1) Roles + Permissions (v1)

### Ironman (CTO)
- Read/write: GitHub PRs, branches, repo files
- Deploy: Vercel/Cloud Run **requires approval**
- Infra changes: **approval required**

### Hulk (QA/Debug)
- Read repos, run tests, create issues
- No deploy rights

### Black Widow (Support)
- Read support inbox/tickets
- Draft replies; **send requires approval** (v1)

### Thor (Growth)
- Draft campaigns, landing copy, assets
- Schedule posts **requires approval**

### Hawkeye (Social)
- Draft posts, moderate comments
- Publishing **requires approval**

### Vision (Analytics)
- Read analytics + dashboards
- No write access to prod systems

### Spider‑Man (Sales/Retention)
- Draft sequences, proposals
- Send emails **requires approval**

### Doctor Strange (Automation)
- Manage workflows + connectors
- No direct deploy/finance actions

## 2) Approval Levels
- **Level 0 (Auto)**: read‑only actions, drafts
- **Level 1 (Human‑OK)**: email/send/post, repo write
- **Level 2 (Human‑OK + 2FA)**: deploy, billing, DNS

## 3) Connector Scopes (minimum)
- **GitHub**: repo:read, pull_request:write, issues:write
- **Vercel**: deployments:read/write, projects:read
- **Gmail**: read, draft, send (send gated)
- **Stripe**: read‑only until approved

## 4) Logging
- Every tool call logged to `runs`
- Every external write logged to War Room

## 5) Guardrails
- No secrets in chat output
- Cost caps per agent (daily)
- Escalate on errors or ambiguous requests
