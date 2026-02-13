import Link from "next/link";

type Agent = { name: string; role: string };

const fallbackAgents: Agent[] = [
  { name: "Ironman", role: "CTO / Engineering" },
  { name: "Hulk", role: "QA / Debug" },
  { name: "Black Widow", role: "Support" },
  { name: "Captain America", role: "Ops" },
  { name: "Thor", role: "Growth / Marketing" },
  { name: "Hawkeye", role: "Social" },
  { name: "Vision", role: "Analytics" },
  { name: "Spider‑Man", role: "Retention / Sales" },
  { name: "Doctor Strange", role: "Automation" },
];

async function getAgents(): Promise<Agent[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return fallbackAgents;
  try {
    const res = await fetch(`${base}/agents`, { cache: "no-store" });
    if (!res.ok) return fallbackAgents;
    const json = await res.json();
    return json.data || fallbackAgents;
  } catch {
    return fallbackAgents;
  }
}

import ChatPanel, { ChatMessage } from "@/components/ChatPanel";

async function getChat() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return { messages: [], title: "Avengers War Room", events: [], approvals: [] };
  try {
    const convo = await fetch(`${base}/conversations`, { cache: "no-store" }).then((r) => r.json());
    const convoId = convo?.data?.[0]?.id;
    const messages = convoId
      ? await fetch(`${base}/messages?conversation_id=${convoId}`, { cache: "no-store" }).then((r) => r.json())
      : { data: [] };
    const events = await fetch(`${base}/events/github`, { cache: "no-store" }).then((r) => r.json());
    const approvals = await fetch(`${base}/approvals`, { cache: "no-store" }).then((r) => r.json());
    return {
      messages: (messages.data || []) as ChatMessage[],
      title: convo?.data?.[0]?.name || "Avengers War Room",
      events: events.data || [],
      approvals: approvals.data || [],
    };
  } catch {
    return { messages: [], title: "Avengers War Room", events: [], approvals: [] };
  }
}

export default async function Home() {
  const agents = await getAgents();
  const chat = await getChat();
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-white/5 p-6">
          <div className="text-2xl font-semibold">Doreish</div>
          <div className="mt-6 text-xs uppercase tracking-widest text-white/40">Mission Control</div>
          <nav className="mt-3 space-y-2 text-sm">
            <div className="rounded-lg bg-white/10 px-3 py-2">War Room</div>
            <div className="rounded-lg px-3 py-2 text-white/70">Agents</div>
            <div className="rounded-lg px-3 py-2 text-white/70">Apps</div>
            <div className="rounded-lg px-3 py-2 text-white/70">Tasks</div>
            <div className="rounded-lg px-3 py-2 text-white/70">Runs</div>
          </nav>

          <div className="mt-8 text-xs uppercase tracking-widest text-white/40">Channels</div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="rounded-lg bg-white/10 px-3 py-2"># avengers‑war‑room</div>
            <div className="rounded-lg px-3 py-2 text-white/70"># product‑dev</div>
            <div className="rounded-lg px-3 py-2 text-white/70"># growth</div>
            <div className="rounded-lg px-3 py-2 text-white/70"># support</div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{chat.title}</h1>
              <div className="text-sm text-white/50">Mission Control HQ‑style command center</div>
            </div>
            <Link
              href="#"
              className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              Command Center
            </Link>
          </div>

          <ChatPanel
            title={chat.title}
            initialMessages={chat.messages as ChatMessage[]}
            apiBase={process.env.NEXT_PUBLIC_API_URL}
          />

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Mission Control</h2>
              <p className="mt-2 text-white/70">
                Avengers‑themed AI agents running your SaaS ops: dev, support,
                marketing, sales, retention, and analytics. All under one command
                center.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="text-white/60">Apps</div>
                  <div className="text-2xl font-semibold">2</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="text-white/60">Agents</div>
                  <div className="text-2xl font-semibold">9</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="text-white/60">Workflows</div>
                  <div className="text-2xl font-semibold">5</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="text-white/60">Budget</div>
                  <div className="text-2xl font-semibold">$100/mo</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/40 via-black to-black p-6">
              <h2 className="text-lg font-semibold">Agent Roster</h2>
              <ul className="mt-4 grid gap-3">
                {agents.map((agent) => (
                  <li
                    key={agent.name}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3"
                  >
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-sm text-white/60">{agent.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Webhook UI</h2>
              <p className="mt-2 text-white/70">Connect GitHub to stream repo events into War Room.</p>
              <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4 text-sm">
                <div className="text-white/60">GitHub Webhook URL</div>
                <div className="mt-1 font-mono text-white/90">
                  {process.env.NEXT_PUBLIC_API_URL}/connectors/github/webhook
                </div>
              </div>
              <div className="mt-3 text-xs text-white/50">Use "application/json" content type.</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Latest Repo Events</h2>
              <div className="mt-4 space-y-3 text-sm">
                {chat.events.length === 0 && (
                  <div className="text-white/60">No repo events yet.</div>
                )}
                {chat.events.map((e: any) => (
                  <div key={e.id} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                    <div className="text-white/80">{e.content}</div>
                    <div className="mt-1 text-xs text-white/50">
                      {new Date(e.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Approvals</h2>
            <div className="mt-4 space-y-3 text-sm">
              {chat.approvals.length === 0 && (
                <div className="text-white/60">No approvals pending.</div>
              )}
              {chat.approvals.map((a: any) => (
                <div key={a.id} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                  <div className="text-white/80">{a.action}</div>
                  <div className="mt-1 text-xs text-white/50">Status: {a.status}</div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={async () => {
                        const base = process.env.NEXT_PUBLIC_API_URL;
                        if (!base) return;
                        await fetch(`${base}/approvals/${a.id}/decide`, {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ status: "approved", approved_by: "Ben" }),
                        });
                        location.reload();
                      }}
                      className="rounded-lg border border-white/20 px-3 py-1 text-xs hover:bg-white/10"
                    >
                      Approve
                    </button>
                    <button
                      onClick={async () => {
                        const base = process.env.NEXT_PUBLIC_API_URL;
                        if (!base) return;
                        await fetch(`${base}/approvals/${a.id}/decide`, {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ status: "rejected", approved_by: "Ben" }),
                        });
                        location.reload();
                      }}
                      className="rounded-lg border border-white/20 px-3 py-1 text-xs hover:bg-white/10"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
