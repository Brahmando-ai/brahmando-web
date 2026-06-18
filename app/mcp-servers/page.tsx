import Link from "next/link";
import { Shield, Network, TrendingUp, Scale, MessageCircle } from "lucide-react";
import { PartnerLogosBar } from "@/components/branding/PartnerLogosBar";
import { MCP_TO_AGENT } from "@/lib/agent-runtime";

const servers = [
  {
    id: "compliance-agent",
    icon: Shield,
    category: "Compliance",
    description:
      "Automated compliance checks against GDPR, SOC2, and HIPAA. Returns structured findings with severity scoring.",
    endpoints: [
      { path: "/health", method: "GET", description: "Liveness probe" },
      { path: "/metadata", method: "GET", description: "Server name, version, capabilities" },
      { path: "/execute", method: "POST", description: "Run compliance analysis" },
    ],
  },
  {
    id: "network-agent",
    icon: Network,
    category: "Network",
    description:
      "Network topology analysis, anomaly detection, and intelligent routing recommendations.",
    endpoints: [
      { path: "/health", method: "GET", description: "Liveness probe" },
      { path: "/metadata", method: "GET", description: "Server name, version, capabilities" },
      { path: "/execute", method: "POST", description: "Run network analysis" },
    ],
  },
  {
    id: "finance-agent",
    icon: TrendingUp,
    category: "Finance",
    description:
      "Financial risk scoring, portfolio analysis, and market signal interpretation.",
    endpoints: [
      { path: "/health", method: "GET", description: "Liveness probe" },
      { path: "/metadata", method: "GET", description: "Server name, version, capabilities" },
      { path: "/execute", method: "POST", description: "Run financial analysis" },
    ],
  },
  {
    id: "dikeai",
    icon: Scale,
    category: "Legal & Compliance AI",
    description:
      "Multi-agent compliance and startup legal AI for US SMBs. Routes natural-language questions through specialised agents covering tax, legal, cybersecurity, consumer protection, and startup law.",
    endpoints: [
      { path: "/health", method: "GET", description: "Liveness probe" },
      { path: "/analyze", method: "POST", description: "Run multi-agent compliance analysis" },
      { path: "/tools", method: "GET", description: "List available reasoning tools" },
    ],
  },
  {
    id: "narada-mcp",
    icon: MessageCircle,
    category: "Messaging",
    description:
      "WhatsApp MCP server built on the Model Context Protocol TypeScript SDK. Provides a standardised HTTP bridge for agent-driven messaging, customer notifications, and conversation management.",
    endpoints: [
      { path: "/health", method: "GET", description: "Liveness probe" },
      { path: "/metadata", method: "GET", description: "Server name, version, capabilities" },
      { path: "/execute", method: "POST", description: "Send WhatsApp message" },
    ],
  },
];

const methodColor: Record<string, string> = {
  GET: "bg-emerald-400/20 text-emerald-200",
  POST: "bg-cyan-400/20 text-cyan-200",
};

export default function MCPServersPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="section-title">MCP Servers</h1>
          <p className="section-subtitle">
            ManjuLAB R&D MCP servers catalogued in Brahmando. Each exposes standardised endpoints for agent
            execution, metadata discovery, and health checks.
          </p>
          <PartnerLogosBar className="mt-8" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {servers.map((s) => (
            <div key={s.id} className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-400/10">
                  <s.icon size={20} className="text-cyan-200" />
                </div>
                <div>
                  <code className="font-mono text-sm text-slate-100">{s.id}</code>
                  <p className="text-xs text-slate-500">{s.category}</p>
                </div>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-slate-300">{s.description}</p>

              <div className="space-y-2">
                {s.endpoints.map((ep) => (
                  <div key={ep.path} className="flex items-start gap-3 text-sm">
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-semibold ${methodColor[ep.method]}`}
                    >
                      {ep.method}
                    </span>
                    <div>
                      <code className="font-mono text-slate-100">{ep.path}</code>
                      <p className="text-xs text-slate-400">{ep.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs text-slate-400">
                Source: <code className="font-mono">/mcp-servers/{s.id}/</code>
              </p>
              {MCP_TO_AGENT[s.id] ? (
                <Link
                  href={`/agents/${MCP_TO_AGENT[s.id]}`}
                  className="mt-4 inline-flex text-sm font-medium text-cyan-300 hover:text-cyan-100"
                >
                  Try {MCP_TO_AGENT[s.id]} agent →
                </Link>
              ) : (
                <p className="mt-4 text-xs text-slate-500">GPU deployment coming soon</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-6">
          <h3 className="mb-2 font-semibold text-cyan-100">Access &amp; deployment</h3>
          <p className="text-sm leading-relaxed text-cyan-50/90">
            Hosted deployment, environment configuration, and integration guides are provided to
            ManjuLAB customers and approved community partners — not as anonymous public self-serve.{" "}
            <Link href="/access" className="font-semibold text-cyan-100 underline-offset-2 hover:underline">
              Request access
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
