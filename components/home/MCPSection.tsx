import Link from "next/link";
import { Server, Shield, TrendingUp, Network, Scale, MessageCircle } from "lucide-react";

const servers = [
  {
    icon: Shield,
    name: "compliance-agent",
    description: "Automated compliance checks, policy enforcement, and audit trail generation.",
    endpoints: ["/health", "/execute", "/metadata"],
  },
  {
    icon: Network,
    name: "network-agent",
    description: "Network topology analysis, anomaly detection, and intelligent routing.",
    endpoints: ["/health", "/execute", "/metadata"],
  },
  {
    icon: TrendingUp,
    name: "finance-agent",
    description: "Financial analysis, risk assessment, and portfolio intelligence.",
    endpoints: ["/health", "/execute", "/metadata"],
  },
  {
    icon: Scale,
    name: "dikeai",
    description: "Multi-agent compliance and startup legal AI for US SMBs — tax, legal, cybersecurity, and startup law in plain English.",
    endpoints: ["/health", "/analyze", "/tools"],
  },
  {
    icon: MessageCircle,
    name: "narada-mcp",
    description: "WhatsApp MCP server built on the Model Context Protocol SDK. Send messages and manage customer communications via a standardised HTTP bridge.",
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
            ManjuLAB R&D maintains these Model Context Protocol FastAPI servers in Brahmando. They expose
            domain intelligence as standardised endpoints for customers and community partners under
            ManjuLAB access terms.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {servers.map((s) => {
            const Icon = s.icon ?? Server;
            return (
              <div key={s.name} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-400/10">
                    <Icon size={18} className="text-cyan-200" />
                  </div>
                  <code className="text-sm font-mono text-slate-100">{s.name}</code>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-300">{s.description}</p>
                <div className="flex flex-wrap gap-2">
                  {s.endpoints.map((ep) => (
                    <span
                      key={ep}
                      className="rounded border border-slate-300/20 bg-slate-900/55 px-2 py-1 font-mono text-xs text-slate-200"
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
            View MCP catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
