"use client";

import { useEffect, useState } from "react";

interface Service {
  icon: string;
  title: string;
  description: string;
  url: string;
}

const SERVICES: Service[] = [
  {
    icon: "🌐",
    title: "Manjulab Dashboard",
    description: "Central control hub for ManjuLAB operations",
    url: "https://manjulab.brahmando.com",
  },
  {
    icon: "⚙️",
    title: "API",
    description: "REST API — interactive docs & explorer",
    url: "https://api.brahmando.com/docs",
  },
  {
    icon: "🧪",
    title: "Workflows",
    description: "Agentic workflow orchestration engine",
    url: "https://workflows.brahmando.com",
  },
  {
    icon: "🤖",
    title: "Agents",
    description: "Autonomous AI agents runtime",
    url: "https://agents.brahmando.com",
  },
  {
    icon: "🧠",
    title: "Ollama",
    description: "Local large-language-model inference",
    url: "https://ollama.brahmando.com/api/tags",
  },
  {
    icon: "🧩",
    title: "MCP Servers",
    description: "Model Context Protocol server fleet",
    url: "https://mcp.brahmando.com",
  },
];

type StatusMap = Record<string, "checking" | "online" | "offline">;

export default function PlatformPage() {
  const [statuses, setStatuses] = useState<StatusMap>(() =>
    Object.fromEntries(SERVICES.map((s) => [s.url, "checking" as const]))
  );
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  async function checkService(url: string): Promise<"online" | "offline"> {
    try {
      await fetch(url, { method: "GET", mode: "no-cors" });
      return "online";
    } catch {
      return "offline";
    }
  }

  async function runHealthChecks() {
    const results = await Promise.all(
      SERVICES.map(async (s) => ({ url: s.url, status: await checkService(s.url) }))
    );
    setStatuses(
      Object.fromEntries(results.map(({ url, status }) => [url, status]))
    );
    setLastChecked(new Date());
  }

  useEffect(() => {
    runHealthChecks();
    const interval = setInterval(runHealthChecks, 10_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onlineCount = Object.values(statuses).filter((s) => s === "online").length;

  return (
    <div className="min-h-screen py-16">
      {/* ── Header ── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium mb-8"
          style={{ borderColor: "var(--border)", background: "var(--accent-dim)", color: "var(--accent)" }}>
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
          Live Health Monitor
        </div>

        <h1 className="section-title text-5xl">
          🚀{" "}
          <span className="text-gradient">Brahmando Platform</span>
        </h1>
        <p className="section-subtitle mx-auto mt-4 text-center">
          AI + Workflows + Agents + Tools
        </p>

        {/* ── Summary bar ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          <span>
            <span className="font-semibold text-slate-100">{onlineCount}</span>
            {" / "}
            <span className="font-semibold text-slate-100">{SERVICES.length}</span>
            {" services online"}
          </span>
          {lastChecked && (
            <span>
              Last checked:{" "}
              <span className="font-semibold text-slate-100">
                {lastChecked.toLocaleTimeString()}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* ── Service grid ── */}
      <div className="mx-auto mt-12 max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const status = statuses[service.url];
            return (
              <ServiceCard key={service.url} service={service} status={status} />
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mt-16 text-center text-sm text-slate-500">
        Powered by Brahmando AI Platform
      </div>
    </div>
  );
}

/* ─────────────────────────────── ServiceCard ─────────────────────────────── */

function StatusDot({ status }: { status: "checking" | "online" | "offline" }) {
  if (status === "checking") {
    return (
      <span
        className="h-2.5 w-2.5 rounded-full animate-pulse"
        style={{ background: "#94a3b8" }}
        title="Checking…"
      />
    );
  }
  if (status === "online") {
    return (
      <span
        className="relative flex h-2.5 w-2.5"
        title="Online"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
          style={{ background: "#4ade80" }} />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full"
          style={{ background: "#22c55e" }} />
      </span>
    );
  }
  return (
    <span
      className="h-2.5 w-2.5 rounded-full"
      style={{ background: "#ef4444" }}
      title="Offline"
    />
  );
}

function ServiceCard({
  service,
  status,
}: {
  service: Service;
  status: "checking" | "online" | "offline";
}) {
  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card group relative flex flex-col gap-3"
      style={{ textDecoration: "none" }}
    >
      {/* Status dot — top right */}
      <span className="absolute top-4 right-4 flex items-center justify-center">
        <StatusDot status={status} />
      </span>

      {/* Icon */}
      <span className="text-3xl leading-none select-none" aria-hidden="true">
        {service.icon}
      </span>

      {/* Title */}
      <h2 className="text-base font-semibold text-slate-100 group-hover:text-gradient pr-6 transition-colors">
        {service.title}
      </h2>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed">
        {service.description}
      </p>

      {/* URL slug */}
      <p className="mt-auto font-mono text-xs truncate"
        style={{ color: "var(--accent)" }}>
        {new URL(service.url).hostname}
      </p>

      {/* Status label */}
      <div className="flex items-center gap-1.5 text-xs font-medium"
        style={{
          color:
            status === "online"
              ? "#22c55e"
              : status === "offline"
              ? "#ef4444"
              : "#94a3b8",
        }}>
        <StatusDot status={status} />
        {status === "online" ? "Online" : status === "offline" ? "Offline" : "Checking…"}
      </div>
    </a>
  );
}
