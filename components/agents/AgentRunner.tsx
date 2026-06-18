"use client";

import { useState, useCallback, type FormEvent } from "react";
import { Loader2, Play, ExternalLink } from "lucide-react";
import {
  RUN_AGENT_API,
  CHAT_STREAM_API,
  N8N_URL,
  type AgentRuntime,
} from "@/lib/agent-runtime";

interface AgentRunnerProps {
  agentId: string;
  agentName: string;
  runtime: AgentRuntime;
}

function formatEdgeResult(data: unknown): string {
  const body = data as {
    result?: { output?: unknown; success?: boolean; error?: string | null };
    status?: string;
  };
  const output = body?.result?.output;
  if (output === undefined || output === null) {
    return JSON.stringify(data, null, 2);
  }
  return typeof output === "string"
    ? output
    : JSON.stringify(output, null, 2);
}

export function AgentRunner({ agentId, agentName, runtime }: AgentRunnerProps) {
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runEdge = useCallback(
    async (text: string) => {
      const res = await fetch(RUN_AGENT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          agent: runtime.runAgent ?? agentId,
          model: "auto",
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }
      const data = await res.json();
      setOutput(formatEdgeResult(data));
    },
    [agentId, runtime.runAgent]
  );

  const runChat = useCallback(async (text: string) => {
    const res = await fetch(CHAT_STREAM_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `[${agentName}] ${text}`,
        session_id: crypto.randomUUID(),
      }),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response stream");

    const decoder = new TextDecoder();
    let buffer = "";
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6);
        if (payload.startsWith("{") && payload.includes('"tier"')) continue;
        if (payload === "[DONE]") break;
        full += payload;
        setOutput(full);
      }
    }
  }, [agentName]);

  const runQuery = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setLoading(true);
      setError(null);
      setOutput("");

      try {
        if (runtime.type === "edge") {
          await runEdge(trimmed);
        } else if (runtime.type === "chat") {
          await runChat(trimmed);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Request failed");
      } finally {
        setLoading(false);
      }
    },
    [loading, runtime.type, runEdge, runChat]
  );

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await runQuery(query);
    },
    [query, runQuery]
  );

  const onSampleClick = useCallback(
    (sample: string) => {
      setQuery(sample);
      void runQuery(sample);
    },
    [runQuery]
  );

  if (runtime.type === "workflow" && runtime.externalUrl) {
    return (
      <div className="rounded-xl border border-violet-300/30 bg-violet-400/10 p-6">
        <h2 className="text-lg font-semibold text-slate-100">Open workflow</h2>
        <p className="mt-2 text-sm text-slate-300">
          This workflow runs on the Brahmando n8n instance.
        </p>
        <a
          href={runtime.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-4 inline-flex items-center gap-2"
        >
          Open in n8n
          <ExternalLink size={14} />
        </a>
      </div>
    );
  }

  if (runtime.type === "none") {
    return null;
  }

  return (
    <div className="rounded-xl border border-cyan-300/25 bg-slate-900/60 p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-100">Try it live</h2>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            runtime.status === "live"
              ? "bg-emerald-400/20 text-emerald-200"
              : "bg-amber-400/20 text-amber-200"
          }`}
        >
          {runtime.status === "live" ? "Live on GPU" : "Chat preview"}
        </span>
      </div>

      {runtime.sampleQuestions && runtime.sampleQuestions.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Try a sample question
          </p>
          <div className="flex flex-wrap gap-2">
            {runtime.sampleQuestions.map((sample) => (
              <button
                key={sample}
                type="button"
                disabled={loading}
                onClick={() => onSampleClick(sample)}
                className="rounded-full border border-slate-600/60 bg-slate-950/60 px-3 py-1.5 text-left text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-100 disabled:opacity-40"
              >
                {sample.length > 72 ? `${sample.slice(0, 72)}…` : sample}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            runtime.placeholder ??
            "Describe what you want this agent to analyse…"
          }
          rows={4}
          disabled={loading}
          className="w-full rounded-xl border border-slate-600/50 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-40"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Play size={16} />
          )}
          Run agent
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      {output && (
        <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
          {output}
        </pre>
      )}

      {runtime.type === "edge" && (
        <p className="mt-3 text-xs text-slate-500">
          Sends a POST request to the agent API (browser-safe proxy).
        </p>
      )}
    </div>
  );
}

export { N8N_URL };
