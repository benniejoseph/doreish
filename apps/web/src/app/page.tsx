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

type ChatMessage = { id: string; sender: string; content: string; created_at: string; thread_id?: string | null };

const AVATARS: Record<string, string> = {
  Ironman: "🦾",
  Hulk: "💚",
  "Black Widow": "🕷️",
  "Captain America": "🛡️",
  Thor: "⚡",
  Hawkeye: "🎯",
  Vision: "🔮",
  "Spider‑Man": "🕸️",
  "Doctor Strange": "🌀",
  System: "🧠",
};

function timeAgo(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function getChat() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return { messages: [], title: "Avengers War Room" };
  try {
    const convo = await fetch(`${base}/conversations`, { cache: "no-store" }).then((r) => r.json());
    const convoId = convo?.data?.[0]?.id;
    const messages = convoId
      ? await fetch(`${base}/messages?conversation_id=${convoId}`, { cache: "no-store" }).then((r) => r.json())
      : { data: [] };
    return { messages: (messages.data || []) as ChatMessage[], title: convo?.data?.[0]?.name || "Avengers War Room" };
  } catch {
    return { messages: [], title: "Avengers War Room" };
  }
}

export default async function Home() {
  const agents = await getAgents();
  const chat = await getChat();
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Doreish</h1>
          <Link
            href="#"
            className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            Command Center
          </Link>
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Mission Control</h2>
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
            <h2 className="text-xl font-semibold">Agent Roster</h2>
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

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Next Steps</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-white/70">
              <li>Connect GitHub + Vercel + email + support.</li>
              <li>Define approvals for high‑risk actions.</li>
              <li>Launch MVP workflows: bugfix, support, campaign, social, retention.</li>
            </ol>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">{chat.title}</h3>
            <div className="mt-4 max-h-80 space-y-3 overflow-auto text-sm">
              {chat.messages.length === 0 && (
                <div className="text-white/60">No messages yet.</div>
              )}
              {chat.messages.map((m) => (
                <div key={m.id} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                  <div className="flex items-center justify-between text-white/60">
                    <div className="flex items-center gap-2">
                      <span>{AVATARS[m.sender] || "👤"}</span>
                      <span>{m.sender}</span>
                      {m.thread_id && <span className="text-xs text-white/40">thread</span>}
                    </div>
                    <span className="text-xs">{timeAgo(m.created_at)}</span>
                  </div>
                  <div className="mt-1 text-white/90">{m.content}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
