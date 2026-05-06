"use client";

import { useEffect, useState } from "react";
import {
  PLATFORM_HEALTH_URL,
  mapHealthResponse,
  type ServiceStatus,
  type ServiceInfo,
  type StatusMap,
} from "@/lib/platform-health";

// ── Types ──────────────────────────────────────────────────────────────────

interface Service {
  /** Matches the `key` field returned by the platform-health endpoint. */
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

/** Timeout (ms) after which a still-"checking" service is marked offline. */
const CHECKING_TIMEOUT_MS = 3_000;

/**
 * Fallback: probe each service URL directly with mode:"no-cors".
 * We can only detect reachability (no status codes), so a resolved
 * fetch is labelled "online" and a rejected one "offline".
 */
async function directChecks(): Promise<StatusMap> {
  const results = await Promise.allSettled(
    SERVICES.map(async (svc) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), CHECKING_TIMEOUT_MS);
      try {
        await fetch(svc.url, { mode: "no-cors", signal: controller.signal });
        return { key: svc.key, status: "online" as ServiceStatus };
      } catch {
        return { key: svc.key, status: "offline" as ServiceStatus };
      } finally {
        clearTimeout(timer);
      }
    })
  );

  return Object.fromEntries(
    results.map((r) => {
      if (r.status === "fulfilled") {
        return [r.value.key, { status: r.value.status }];
      }
      // Should not happen (inner catch handles errors), but guard anyway.
      return ["unknown", { status: "offline" as ServiceStatus }];
    })
  );
}

export default function PlatformPage() {
  const [statuses, setStatuses] = useState<StatusMap>(() =>
    Object.fromEntries(SERVICES.map((s) => [s.key, { status: "checking" as const }]))
  );
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  async function runHealthChecks() {
    // ── 1. Try aggregator endpoint ──────────────────────────────────────
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), CHECKING_TIMEOUT_MS);
      let res: Response;
      try {
        res = await fetch(PLATFORM_HEALTH_URL, { signal: controller.signal });
      } finally {
        clearTimeout(timer);
      }
      if (res.ok) {
        const data = await res.json();
        setStatuses(mapHealthResponse(data));
        setLastChecked(new Date());
        setUsingFallback(false);
        return;
      }
    } catch {
      // Aggregator unreachable — fall through to direct checks.
    }

    // ── 2. Fallback: direct no-cors probes ──────────────────────────────
    setUsingFallback(true);
    const fallback = await directChecks();
    setStatuses(fallback);
    setLastChecked(new Date());
  }

  useEffect(() => {
    runHealthChecks();
    const interval = setInterval(runHealthChecks, 10_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Safety net: after CHECKING_TIMEOUT_MS, flip any remaining "checking"
  // entries to "offline" so the UI is never stuck indefinitely.
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatuses((prev) => {
        const hasChecking = Object.values(prev).some(
          (i) => i.status === "checking"
        );
        if (!hasChecking) return prev;
        return Object.fromEntries(
          Object.entries(prev).map(([key, info]) => [
            key,
            info.status === "checking" ? { status: "offline" as const } : info,
          ])
        );
      });
    }, CHECKING_TIMEOUT_MS);
    return () => clearTimeout(timer);
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

        {/* ── Fallback banner ── */}
        {usingFallback && (
          <div className="mt-4 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-400">
            Health service unreachable — using direct checks
          </div>
        )}
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
