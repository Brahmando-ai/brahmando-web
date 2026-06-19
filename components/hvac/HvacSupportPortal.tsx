"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createHvacSession,
  fetchHvacHealth,
  queryHvac,
  submitHvacFeedback,
  type HvacHealthResponse,
  type HvacQueryResponse,
  type SupportLevel,
} from "@/lib/hvac-api";

const LEVELS: { id: SupportLevel; label: string; desc: string }[] = [
  { id: "L1", label: "L1 · Remote", desc: "Homeowner / front-desk safe steps" },
  { id: "L2", label: "L2 · Field tech", desc: "Diagnostics, parts, on-site guidance" },
  { id: "L3", label: "L3 · Escalation", desc: "Dispatch, safety, specialist + ticket" },
];

const SAMPLES: Record<SupportLevel, string[]> = {
  L1: [
    "Carrier Infinity in Florida — fan Auto or Low for humidity?",
    "AC not cooling — what can I check before calling a tech?",
    "Thermostat blank after power outage",
  ],
  L2: [
    "Outdoor unit hums but fan won't spin — capacitor test steps?",
    "15°F delta-T at supply — what next for no-cool call?",
    "Carrier Infinity 3-blink communication fault",
  ],
  L3: [
    "Gas smell near furnace — nursing home C-03",
    "Refrigerant leak suspected after ice on line",
    "Dispatch tech — repeated breaker trip after L2 capacitor swap",
  ],
};

type ChatMsg = {
  role: "user" | "bot";
  text: string;
  meta?: HvacQueryResponse;
};

export function HvacSupportPortal() {
  const [level, setLevel] = useState<SupportLevel>("L1");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [feedbackFor, setFeedbackFor] = useState<HvacQueryResponse | null>(null);
  const [rating, setRating] = useState(5);
  const [correction, setCorrection] = useState("");
  const [techId, setTechId] = useState("");
  const [health, setHealth] = useState<HvacHealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHvacHealth()
      .then((h) => {
        setHealth(h);
        setHealthError(null);
      })
      .catch((e) => {
        setHealth(null);
        setHealthError(e instanceof Error ? e.message : "API unreachable");
      });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, feedbackFor]);

  const ensureSession = useCallback(async (lvl: SupportLevel) => {
    if (sessionId) return sessionId;
    const s = await createHvacSession(lvl);
    setSessionId(s.id);
    return s.id;
  }, [sessionId]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || typing) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setTyping(true);
    setFeedbackFor(null);
    try {
      const sid = await ensureSession(level);
      const data = await queryHvac(msg, sid, level);
      setSessionId(data.session_id);
      if (data.suggest_level && data.suggest_level !== level) {
        setLevel(data.suggest_level);
      }
      let answer = data.answer;
      if (data.citations.length) {
        answer += `\n\nSources: ${data.citations.slice(0, 3).join(" · ")}`;
      }
      if (data.ticket_id) {
        answer += `\n\nTicket: #${data.ticket_id}`;
      }
      setMessages((m) => [...m, { role: "bot", text: answer, meta: data }]);
      if (data.level === "L2" || data.level === "L3") {
        setFeedbackFor(data);
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: `Could not reach HVAC Support API. ${e instanceof Error ? e.message : "Network error"}`,
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  async function submitFeedback() {
    if (!feedbackFor || !sessionId) return;
    try {
      const res = await submitHvacFeedback({
        session_id: sessionId,
        query_id: feedbackFor.query_id,
        rating,
        helpful: rating >= 3,
        correction,
        technician_id: techId,
      });
      setMessages((m) => [...m, { role: "bot", text: res.message }]);
      setFeedbackFor(null);
      setCorrection("");
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "bot", text: `Feedback failed: ${e instanceof Error ? e.message : "error"}` },
      ]);
    }
  }

  function switchLevel(lvl: SupportLevel) {
    setLevel(lvl);
    setSessionId(null);
    setFeedbackFor(null);
    setMessages([
      {
        role: "bot",
        text: `Switched to ${lvl}. ${LEVELS.find((x) => x.id === lvl)?.desc}. Ask your HVAC question below.`,
      },
    ]);
  }

  return (
    <div className="mx-auto max-w-4xl">
      {healthError && (
        <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          HVAC API is not reachable yet ({healthError}). The portal shell loads, but queries will fail until
          api.brahmando.com/hvac is live.
        </div>
      )}
      {health && health.kb_points < 5 && (
        <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Knowledge base is still seeding ({health.kb_points} chunks in <code className="text-amber-50">{health.collection}</code>).
          Answers may be limited until more HVAC docs are ingested.
        </div>
      )}
      {health && health.kb_points >= 5 && (
        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-100/90">
          KB ready — {health.kb_points} chunks in collection <code className="text-emerald-50">{health.collection}</code> (separate from Education&apos;s education_kb).
        </div>
      )}

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => switchLevel(l.id)}
            className={`rounded-xl border px-3 py-3 text-left transition-colors ${
              level === l.id
                ? "border-orange-400/50 bg-orange-500/10"
                : "border-slate-700/50 bg-slate-900/30 hover:border-orange-300/30"
            }`}
          >
            <p className="text-sm font-semibold text-orange-100">{l.label}</p>
            <p className="mt-1 text-xs text-slate-400">{l.desc}</p>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/40">
        <div ref={scrollRef} className="h-[420px] space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="text-sm text-slate-400">
              Ask a real HVAC question — answers use the knowledge base + Ollama on the Brahmando cluster.
              L3 opens a Nandi support ticket when escalation is needed.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[92%] whitespace-pre-wrap rounded-xl px-3 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-orange-600 text-white"
                  : "border border-slate-600/50 bg-slate-800/80 text-slate-100"
              }`}
            >
              {m.text}
            </div>
          ))}
          {typing && <p className="text-xs text-slate-500">Analyzing…</p>}
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-slate-700/50 px-3 py-2">
          {SAMPLES[level].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="rounded-full border border-slate-600 px-2.5 py-1 text-[11px] text-slate-400 hover:border-orange-400/50 hover:text-orange-200"
            >
              {q.length > 52 ? `${q.slice(0, 49)}…` : q}
            </button>
          ))}
        </div>

        <div className="flex gap-2 border-t border-slate-700/50 p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Ask as ${level} support…`}
            className="flex-1 rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-orange-400"
          />
          <button
            type="button"
            onClick={() => send()}
            disabled={typing}
            className="rounded-lg bg-orange-600 px-4 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {feedbackFor && (feedbackFor.level === "L2" || feedbackFor.level === "L3") && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <h3 className="text-sm font-semibold text-amber-100">Technician feedback ({feedbackFor.level})</h3>
          <p className="mt-1 text-xs text-slate-400">
            Help the system learn — approved corrections are added to the knowledge base.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="text-xs text-slate-300">
              Rating
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="ml-2 rounded border border-slate-600 bg-slate-900 px-2 py-1"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <input
              type="text"
              value={techId}
              onChange={(e) => setTechId(e.target.value)}
              placeholder="Technician ID (optional)"
              className="rounded border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-200"
            />
          </div>
          <textarea
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            placeholder="What worked on site? Correct or add detail for the next tech…"
            rows={3}
            className="mt-3 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          />
          <button
            type="button"
            onClick={submitFeedback}
            className="mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500"
          >
            Submit feedback
          </button>
        </div>
      )}
    </div>
  );
}
