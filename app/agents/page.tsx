import Link from "next/link";
import agentRegistry from "@/lib/agents-registry.json";

export default function AgentsPage() {
  const agents = agentRegistry.agents;

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="section-title">Live agents</h1>
          <p className="section-subtitle max-w-3xl">
            Agents currently deployed on the Brahmando GPU stack. The public catalog of demo agents and MCP
            listings has been retired — use Platform for service health and Access for deployment requests.
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
          Looking for Education Portal or CSR programs?{" "}
          <Link href="/csr" className="text-cyan-200 hover:underline">
            Start at CSR →
          </Link>
        </p>
      </div>
    </div>
  );
}
