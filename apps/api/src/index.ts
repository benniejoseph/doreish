import "dotenv/config";
import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

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

app.post("/tasks", async (req, res) => {
  const { app_id, agent_id, type, input, priority } = req.body || {};
  const { rows } = await pool.query(
    "insert into tasks (app_id, agent_id, type, input, priority) values ($1,$2,$3,$4,$5) returning *",
    [app_id || null, agent_id || null, type, input || {}, priority || 3]
  );
  res.json({ data: rows[0] });
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

app.post("/messages", async (req, res) => {
  const convo = await ensureConversation();
  const { sender, role, content, conversation_id } = req.body || {};
  const { rows } = await pool.query(
    "insert into messages (conversation_id, sender, role, content) values ($1,$2,$3,$4) returning *",
    [conversation_id || convo.id, sender || "System", role || "agent", content]
  );
  res.json({ data: rows[0] });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`doreish-api listening on ${port}`);
});
