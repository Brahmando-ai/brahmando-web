import Link from "next/link";
import { Server, Shield, TrendingUp, Network, Scale, MessageCircle } from "lucide-react";

const servers = [
  {
    icon: Shield,
    name: "compliance-agent",
    description: "Automated compliance analysis with policy enforcement, severity scoring, and audit trail generation across GDPR, SOC2, and HIPAA frameworks.",
    endpoints: ["/health", "/execute", "/metadata"],
  },
  {
    icon: Network,
    name: "network-agent",
    description: "Network topology analysis, anomaly detection, and intelligent routing recommendations for enterprise infrastructure.",
    endpoints: ["/health", "/execute", "/metadata"],
  },
  {
    icon: TrendingUp,
    name: "finance-agent",
    description: "Financial risk scoring, portfolio analysis, and market signal interpretation for enterprise finance teams.",
    endpoints: ["/health", "/execute", "/metadata"],
  },
  {
    icon: Scale,
    name: "dikeai",
    description: "Multi-agent legal and compliance AI for US SMBs — tax, cybersecurity, consumer protection, and startup law delivered in plain English.",
    endpoints: ["/health", "/analyze", "/tools"],
  },
  {
    icon: MessageCircle,
    name: "narada-mcp",
    description: "WhatsApp MCP server built on the Model Context Protocol SDK — a standardised HTTP bridge for agent-driven messaging and customer communication.",
    endpoints: ["/health", "/execute", "/metadata"],
  },
];

export function MCPSection() {
  return (
    <section className="py-24" id="mcp-servers">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="section-title">MCP Servers</h2>
          <p className="section-subtitle mx-auto text-center">
            Model Context Protocol servers from the Brahmando catalog — standardised FastAPI
            endpoints that surface domain intelligence directly to agents and integrations.
            Deployment is available through customer and community access programs.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {servers.map((s) => {
            const Icon = s.icon ?? Server;
            return (
              <div key={s.name} className="card">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ border: "1px solid var(--border)", background: "var(--accent-dim)" }}
                  >
                    <Icon size={17} style={{ color: "var(--accent)" }} />
                  </div>
                  <code className="font-mono text-sm text-slate-200">{s.name}</code>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-400">{s.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.endpoints.map((ep) => (
                    <span
                      key={ep}
                      className="rounded border px-2 py-0.5 font-mono text-xs text-slate-300"
                      style={{ borderColor: "var(--border)", background: "var(--panel)" }}
                    >
                      {ep}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link href="/mcp-servers" className="btn-secondary">
            View full MCP catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
