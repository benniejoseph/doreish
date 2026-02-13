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

export default async function Home() {
  const agents = await getAgents();
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

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">Next Steps</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-white/70">
            <li>Connect GitHub, Vercel, Supabase, Upstash.</li>
            <li>Define approval levels for production actions.</li>
            <li>Launch MVP workflows: bugfix, support, campaign, social, retention.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
