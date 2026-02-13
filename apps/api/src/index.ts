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

app.get("/agents", (_req, res) => {
  res.json({
    data: [
      { name: "Ironman", role: "CTO / Engineering" },
      { name: "Hulk", role: "QA / Debug" },
      { name: "Black Widow", role: "Support" },
      { name: "Captain America", role: "Ops" },
      { name: "Thor", role: "Growth / Marketing" },
      { name: "Hawkeye", role: "Social" },
      { name: "Vision", role: "Analytics" },
      { name: "Spider‑Man", role: "Retention / Sales" },
      { name: "Doctor Strange", role: "Automation" }
    ]
  });
});

app.get("/tasks", (_req, res) => {
  res.json({ data: [] });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`doreish-api listening on ${port}`);
});
