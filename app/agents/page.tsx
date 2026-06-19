import Link from "next/link";
import agentRegistry from "@/lib/agents-registry.json";
import { LIVE_MCP_SERVERS, platformStats } from "@/lib/platform-catalog";

export default function AgentsPage() {
  const agents = agentRegistry.agents;

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="section-title">Live agents</h1>
          <p className="section-subtitle max-w-3xl">
            <strong className="text-slate-100">{platformStats.agents} agents</strong> deployed on the Brahmando GPU
            stack today (Hermes, Mercury). Mercury routes to{" "}
            <strong className="text-slate-100">{platformStats.mcpServers} MCP servers</strong> (DikeAI, Narada) when
            needed. Additional catalog demos were retired from the public site.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {agents.map((agent) => (
            <Link key={agent.id} href={`/agents/${agent.id}`} className="card group">
              <div className="mb-3 flex items-start justify-between">
                <span className="tag">{agent.category}</span>
                <span className="font-mono text-xs text-slate-500">:{agent.port}</span>
              </div>
              <h3 className="font-semibold text-slate-200 transition-colors group-hover:text-white">
                {agent.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{agent.description}</p>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-sm text-slate-400">
          MCP servers on cluster:{" "}
          {LIVE_MCP_SERVERS.map((s) => s.name).join(", ")}.{" "}
          <Link href="/platform" className="text-cyan-200 hover:underline">
            Platform health →
          </Link>
        </p>
        <p className="mt-3 text-sm text-slate-400">
          Education Portal & CSR:{" "}
          <Link href="/csr" className="text-cyan-200 hover:underline">
            CSR programs →
          </Link>
        </p>
      </div>
    </div>
  );
}
