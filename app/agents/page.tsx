import Link from "next/link";
import agentRegistry from "@/lib/agents-registry.json";
import { PartnerLogosBar } from "@/components/branding/PartnerLogosBar";

export default function AgentsPage() {
  const agents = agentRegistry.agents;
  const categories = Array.from(new Set(agents.map((a) => a.category)));

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="section-title">Agents Catalog</h1>
          <p className="section-subtitle">
            {agents.length} agents in the Brahmando catalog · Browse the index below.
          </p>
          <PartnerLogosBar className="mt-8" />
        </div>

        <div className="mb-10 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-5 text-sm leading-relaxed text-cyan-50/95">
          <strong className="text-cyan-100">Access:</strong> Catalog content is curated by ManjuLAB R&amp;D.
          Browsing this index is open; execution, deployment, and detailed documentation require a
          ManjuLAB customer agreement or the community access program.{" "}
          <Link href="/access" className="font-semibold text-cyan-100 underline-offset-2 hover:underline">
            Request access
          </Link>
          .
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          <span className="tag cursor-pointer bg-cyan-400 text-slate-950">All</span>
          {categories.map((cat) => (
            <span
              key={cat}
              className="tag cursor-pointer hover:border-cyan-300/50 hover:text-cyan-100 transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Link key={agent.id} href={`/agents/${agent.id}`} className="card group">
              <div className="flex items-start justify-between mb-3">
                <span className="tag">{agent.category}</span>
                <span className="text-xs font-mono text-slate-400">{agent.version}</span>
              </div>
              <h3 className="font-semibold text-slate-100 group-hover:text-cyan-200 transition-colors">
                {agent.name}
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed line-clamp-3">{agent.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-300/20 bg-slate-900/55 px-2 py-0.5 text-xs text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {agent.mcpServer && (
                <p className="mt-3 font-mono text-xs text-cyan-200">MCP: {agent.mcpServer}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
