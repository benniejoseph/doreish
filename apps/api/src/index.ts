import "dotenv/config";
import express from "express";
import crypto from "crypto";
import { pool } from "./db.js";

const app = express();
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  },
}));

app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("select now() as now");
    res.json({ ok: true, db: true, now: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ ok: false, db: false });
  }
});

const DEFAULT_AGENTS = [
  { name: "Ironman", role: "CTO / Engineering" },
  { name: "Hulk", role: "QA / Debug" },
  { name: "Black Widow", role: "Support" },
  { name: "Captain America", role: "Ops" },
  { name: "Thor", role: "Growth / Marketing" },
  { name: "Hawkeye", role: "Social" },
  { name: "Vision", role: "Analytics" },
  { name: "Spider‑Man", role: "Retention / Sales" },
  { name: "Doctor Strange", role: "Automation" }
];

async function ensureAgents() {
  const { rows } = await pool.query("select count(*)::int as count from agents");
  if (rows[0].count > 0) return;
  for (const agent of DEFAULT_AGENTS) {
    await pool.query(
      "insert into agents (name, role) values ($1, $2)",
      [agent.name, agent.role]
    );
  }
}

async function ensureConversation() {
  const { rows } = await pool.query("select * from conversations order by created_at asc limit 1");
  if (rows.length) return rows[0];
  const created = await pool.query(
    "insert into conversations (name) values ($1) returning *",
    ["Avengers War Room"]
  );
  return created.rows[0];
}

app.get("/agents", async (_req, res) => {
  await ensureAgents();
  const { rows } = await pool.query("select * from agents order by name asc");
  res.json({ data: rows });
});

app.get("/apps", async (_req, res) => {
  const { rows } = await pool.query("select * from apps order by created_at desc");
  res.json({ data: rows });
});

app.post("/apps", async (req, res) => {
  const { name, domain, repo_url, stack } = req.body || {};
  const { rows } = await pool.query(
    "insert into apps (name, domain, repo_url, stack) values ($1,$2,$3,$4) returning *",
    [name, domain, repo_url, stack || {}]
  );
  res.json({ data: rows[0] });
});

app.get("/tasks", async (_req, res) => {
  const { rows } = await pool.query("select * from tasks order by created_at desc");
  res.json({ data: rows });
});

app.get("/approvals", async (_req, res) => {
  const { rows } = await pool.query("select * from approvals order by created_at desc");
  res.json({ data: rows });
});

app.post("/approvals", async (req, res) => {
  const { task_id, action, requested_by } = req.body || {};
  const { rows } = await pool.query(
    "insert into approvals (task_id, action, requested_by) values ($1,$2,$3) returning *",
    [task_id || null, action, requested_by || "System"]
  );
  res.json({ data: rows[0] });
});

app.post("/approvals/:id/decide", async (req, res) => {
  const { status, approved_by } = req.body || {};
  const { rows } = await pool.query(
    "update approvals set status=$1, approved_by=$2, decided_at=now() where id=$3 returning *",
    [status, approved_by || "Human", req.params.id]
  );
  res.json({ data: rows[0] });
});

app.get("/connectors", async (_req, res) => {
  const { rows } = await pool.query("select * from connectors order by created_at desc");
  res.json({ data: rows });
});

app.post("/connectors", async (req, res) => {
  const { app_id, provider, config } = req.body || {};
  const { rows } = await pool.query(
    "insert into connectors (app_id, provider, config) values ($1,$2,$3) returning *",
    [app_id || null, provider, config || {}]
  );
  res.json({ data: rows[0] });
});

app.get("/connectors/vercel/projects", async (_req, res) => {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return res.status(500).json({ error: "Missing VERCEL_TOKEN" });
  const resp = await fetch("https://api.vercel.com/v9/projects", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await resp.json();
  res.json(data);
});

app.get("/connectors/github/repos", async (_req, res) => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: "Missing GITHUB_TOKEN" });
  const resp = await fetch("https://api.github.com/user/repos?per_page=100", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  const data = await resp.json();
  res.json(data);
});

app.post("/connectors/github/webhook", async (req: any, res) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET || "";
  const sig = req.headers["x-hub-signature-256"] as string | undefined;
  const raw = req.rawBody || Buffer.from("");
  const expected = `sha256=${crypto.createHmac("sha256", secret).update(raw).digest("hex")}`;
  if (!sig || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const payload = req.body;
  const convo = await ensureConversation();
  const repo = payload?.repository?.full_name || "repo";
  const action = payload?.action || "event";

  let detail = "";
  if (payload?.pull_request) {
    detail = `PR #${payload.pull_request.number}: ${payload.pull_request.title}`;
  } else if (payload?.issue) {
    detail = `Issue #${payload.issue.number}: ${payload.issue.title}`;
  } else if (payload?.commits?.length) {
    detail = `Commits: ${payload.commits[0]?.message}`;
  }

  await pool.query(
    "insert into messages (conversation_id, sender, role, content, logs) values ($1,$2,$3,$4,$5)",
    [convo.id, "System", "agent", `GitHub ${action} on ${repo} ${detail}`.trim(), payload]
  );
  res.json({ ok: true });
});

app.post("/tasks", async (req, res) => {
  const { app_id, agent_id, type, input, priority } = req.body || {};
  const { rows } = await pool.query(
    "insert into tasks (app_id, agent_id, type, input, priority) values ($1,$2,$3,$4,$5) returning *",
    [app_id || null, agent_id || null, type, input || {}, priority || 3]
  );
  const convo = await ensureConversation();
  await pool.query(
    "insert into messages (conversation_id, sender, role, content) values ($1,$2,$3,$4)",
    [convo.id, "System", "agent", `Task queued: ${type}`]
  );
  res.json({ data: rows[0] });
});

app.post("/tasks/run", async (req, res) => {
  const { task_id, summary } = req.body || {};
  const convo = await ensureConversation();
  const taskRow = task_id
    ? await pool.query("select * from tasks where id = $1", [task_id])
    : null;
  const base = taskRow?.rows?.[0]?.type || "Task";
  await pool.query(
    "update tasks set status = 'running', updated_at = now() where id = $1",
    [task_id]
  );
  const head = await pool.query(
    "insert into messages (conversation_id, sender, role, content) values ($1,$2,$3,$4) returning *",
    [convo.id, "Ironman", "agent", `${base} started. Coordination in progress.`]
  );
  await pool.query(
    "insert into messages (conversation_id, sender, role, content, thread_id) values ($1,$2,$3,$4,$5)",
    [convo.id, "Hulk", "agent", "Running tests and reproducing issues.", head.rows[0].id]
  );
  await pool.query(
    "insert into messages (conversation_id, sender, role, content, thread_id) values ($1,$2,$3,$4,$5)",
    [convo.id, "Vision", "agent", "Monitoring metrics and costs.", head.rows[0].id]
  );
  await pool.query(
    "insert into runs (task_id, model, status, logs) values ($1,$2,$3,$4)",
    [task_id, "openai", "completed", { summary: summary || `${base} completed.` }]
  );
  await pool.query(
    "update tasks set status = 'completed', updated_at = now() where id = $1",
    [task_id]
  );
  await pool.query(
    "insert into messages (conversation_id, sender, role, content) values ($1,$2,$3,$4)",
    [convo.id, "Ironman", "agent", summary || `${base} completed. Report in thread.`]
  );
  res.json({ ok: true });
});

app.get("/conversations", async (_req, res) => {
  const convo = await ensureConversation();
  res.json({ data: [convo] });
});

app.get("/messages", async (req, res) => {
  const convo = await ensureConversation();
  const conversationId = (req.query.conversation_id as string) || convo.id;
  const { rows } = await pool.query(
    "select * from messages where conversation_id = $1 order by created_at asc",
    [conversationId]
  );
  res.json({ data: rows, conversation_id: conversationId });
});

app.get("/events/github", async (_req, res) => {
  const convo = await ensureConversation();
  const { rows } = await pool.query(
    "select * from messages where conversation_id = $1 and sender = 'System' and content like 'GitHub %' order by created_at desc limit 20",
    [convo.id]
  );
  res.json({ data: rows });
});

app.post("/messages", async (req, res) => {
  const convo = await ensureConversation();
  const { sender, role, content, conversation_id, thread_id } = req.body || {};
  const { rows } = await pool.query(
    "insert into messages (conversation_id, sender, role, content, thread_id) values ($1,$2,$3,$4,$5) returning *",
    [conversation_id || convo.id, sender || "System", role || "agent", content, thread_id || null]
  );
  res.json({ data: rows[0] });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`doreish-api listening on ${port}`);
});
