"use client";

import { useMemo, useState } from "react";

export type ChatMessage = {
  id: string;
  sender: string;
  content: string;
  created_at: string;
  thread_id?: string | null;
};

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

export default function ChatPanel({
  title,
  initialMessages,
  apiBase,
}: {
  title: string;
  initialMessages: ChatMessage[];
  apiBase?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const topLevel = useMemo(
    () => messages.filter((m) => !m.thread_id),
    [messages]
  );
  const [selected, setSelected] = useState<ChatMessage | null>(null);
  const [draft, setDraft] = useState("");

  const threadReplies = useMemo(
    () => messages.filter((m) => m.thread_id === selected?.id),
    [messages, selected]
  );

  async function sendMessage() {
    if (!apiBase || !draft.trim()) return;
    const res = await fetch(`${apiBase}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sender: "System", role: "agent", content: draft }),
    });
    if (res.ok) {
      const json = await res.json();
      setMessages((prev) => [...prev, json.data]);
      setDraft("");
    }
  }

  async function replyThread() {
    if (!apiBase || !draft.trim() || !selected) return;
    const res = await fetch(`${apiBase}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sender: "System",
        role: "agent",
        content: draft,
        thread_id: selected.id,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      setMessages((prev) => [...prev, json.data]);
      setDraft("");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-4 max-h-[60vh] space-y-3 overflow-auto text-sm">
          {messages.length === 0 && (
            <div className="text-white/60">No messages yet.</div>
          )}
          {topLevel.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className={`w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-left hover:border-white/30 ${
                selected?.id === m.id ? "ring-1 ring-white/30" : ""
              }`}
            >
              <div className="flex items-center justify-between text-white/60">
                <div className="flex items-center gap-2">
                  <span>{AVATARS[m.sender] || "👤"}</span>
                  <span>{m.sender}</span>
                  {m.thread_id && (
                    <span className="text-xs text-white/40">thread</span>
                  )}
                </div>
                <span className="text-xs">{timeAgo(m.created_at)}</span>
              </div>
              <div className="mt-1 text-white/90">{m.content}</div>
              <div className="mt-2 text-xs text-white/40">Click to open thread</div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Send a message…"
            className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40"
          />
          <button
            onClick={selected ? replyThread : sendMessage}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            {selected ? "Reply" : "Send"}
          </button>
        </div>
      </section>

      <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">Thread</div>
        {!selected && (
          <div className="mt-3 text-xs text-white/60">
            Select a message to view replies.
          </div>
        )}
        {selected && (
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
              <div className="text-white/60">{selected.sender}</div>
              <div className="mt-1 text-white/90">{selected.content}</div>
            </div>
            {threadReplies.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3"
              >
                <div className="text-white/60">{r.sender}</div>
                <div className="mt-1 text-white/90">{r.content}</div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
