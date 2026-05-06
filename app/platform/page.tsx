"use client";

import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

type ServiceStatus = "checking" | "online" | "protected" | "error" | "offline";

interface ServiceInfo {
  status: ServiceStatus;
  responseTimeMs?: number;
}

type StatusMap = Record<string, ServiceInfo>;

interface Service {
  /** Matches the `key` field returned by /api/platform-health. */
  key: string;
  icon: string;
  title: string;
  description: string;
  /** URL used for the card link (not necessarily the probed URL). */
  url: string;
}

// ── Service definitions ────────────────────────────────────────────────────

const SERVICES: Service[] = [
  {
    key: "manjulab",
    icon: "🌐",
    title: "Manjulab Dashboard",
    description: "Central control hub for ManjuLAB operations",
    url: "https://manjulab.brahmando.com",
  },
  {
    key: "api",
    icon: "⚙️",
    title: "API",
    description: "REST API — interactive docs & explorer",
    url: "https://api.brahmando.com/docs",
  },
  {
    key: "workflows",
    icon: "🧪",
    title: "Workflows",
    description: "Agentic workflow orchestration engine",
    url: "https://workflows.brahmando.com",
  },
  {
    key: "agents",
    icon: "🤖",
    title: "Agents",
    description: "Autonomous AI agents runtime",
    url: "https://agents.brahmando.com",
  },
  {
    key: "ollama",
    icon: "🧠",
    title: "Ollama",
    description: "Local large-language-model inference",
    url: "https://ollama.brahmando.com/api/tags",
  },
  {
    key: "mcp",
    icon: "🧩",
    title: "MCP Servers",
    description: "Model Context Protocol server fleet",
    url: "https://mcp.brahmando.com",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function PlatformPage() {
  const [statuses, setStatuses] = useState<StatusMap>(() =>
    Object.fromEntries(SERVICES.map((s) => [s.key, { status: "checking" as const }]))
  );
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  async function runHealthChecks() {
    try {
      const res = await fetch("/api/platform-health");
      if (!res.ok) return;
      const data = (await res.json()) as {
        services: Record<string, { status: ServiceStatus; responseTimeMs: number }>;
      };
      setStatuses(
        Object.fromEntries(
          Object.entries(data.services).map(([key, info]) => [
            key,
            { status: info.status, responseTimeMs: info.responseTimeMs },
          ])
        )
      );
      setLastChecked(new Date());
    } catch {
      // Network error — leave existing statuses in place
    }
  }

  useEffect(() => {
    runHealthChecks();
    const interval = setInterval(runHealthChecks, 10_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count services that are actively reachable (online or protected).
  const reachableCount = Object.values(statuses).filter(
    ({ status }) => status === "online" || status === "protected"
  ).length;

  return (
    <div className="min-h-screen py-16">
      {/* ── Header ── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium mb-8"
          style={{ borderColor: "var(--border)", background: "var(--accent-dim)", color: "var(--accent)" }}
        >
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
            <span className="font-semibold text-slate-100">{reachableCount}</span>
            {" / "}
            <span className="font-semibold text-slate-100">{SERVICES.length}</span>
            {" services reachable"}
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
            const info = statuses[service.key] ?? { status: "checking" as const };
            return (
              <ServiceCard key={service.key} service={service} info={info} />
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

const STATUS_META: Record<ServiceStatus, { label: string; dotColor: string; pingColor: string | null }> = {
  checking:  { label: "Checking…", dotColor: "#94a3b8", pingColor: null },
  online:    { label: "Online",    dotColor: "#22c55e", pingColor: "#4ade80" },
  protected: { label: "Protected", dotColor: "#3b82f6", pingColor: "#93c5fd" },
  error:     { label: "Error",     dotColor: "#f97316", pingColor: null },
  offline:   { label: "Offline",   dotColor: "#ef4444", pingColor: null },
};

function StatusDot({ status }: { status: ServiceStatus }) {
  const { label, dotColor, pingColor } = STATUS_META[status];

  if (pingColor) {
    return (
      <span className="relative flex h-2.5 w-2.5" title={label}>
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
          style={{ background: pingColor }}
        />
        <span
          className="relative inline-flex h-2.5 w-2.5 rounded-full"
          style={{ background: dotColor }}
        />
      </span>
    );
  }

  return (
    <span
      className={`h-2.5 w-2.5 rounded-full${status === "checking" ? " animate-pulse" : ""}`}
      style={{ background: dotColor }}
      title={label}
    />
  );
}

function StatusLabel({ info }: { info: ServiceInfo }) {
  const { label, dotColor } = STATUS_META[info.status];
  const latency =
    info.responseTimeMs !== undefined && info.status !== "checking"
      ? ` · ${info.responseTimeMs} ms`
      : "";

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: dotColor }}>
      <StatusDot status={info.status} />
      {label}
      {latency && (
        <span className="text-slate-500 font-normal">{latency}</span>
      )}
    </div>
  );
}

function ServiceCard({ service, info }: { service: Service; info: ServiceInfo }) {
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
        <StatusDot status={info.status} />
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
      <p className="mt-auto font-mono text-xs truncate" style={{ color: "var(--accent)" }}>
        {new URL(service.url).hostname}
      </p>

      {/* Status label + latency */}
      <StatusLabel info={info} />
    </a>
  );
}
