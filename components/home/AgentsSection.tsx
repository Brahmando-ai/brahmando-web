import Link from "next/link";
import agentRegistry from "@/lib/agents-registry.json";

export function AgentsSection() {
  const featured = agentRegistry.agents.slice(0, 6);

  return (
    <section className="py-24" id="agents">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="section-title">Agents Repository</h2>
          <p className="section-subtitle mx-auto text-center">
            Browse agents ManjuLAB R&D has published in Brahmando. Deployment and integration require a
            ManjuLAB customer agreement or community program acceptance — see{" "}
            <Link href="/access" className="text-cyan-200 underline-offset-2 hover:underline">
              Access
            </Link>
            .
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((agent) => (
            <Link key={agent.id} href={`/agents/${agent.id}`} className="card group">
              <div className="flex items-start justify-between mb-3">
                <span className="tag">{agent.category}</span>
                <span className="text-xs text-slate-400">{agent.version}</span>
              </div>
              <h3 className="font-semibold text-slate-100 group-hover:text-cyan-200 transition-colors">
                {agent.name}
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed line-clamp-3">{agent.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {agent.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-300/20 bg-slate-900/55 px-2 py-0.5 text-xs text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/agents" className="btn-primary">
            Browse Repository
          </Link>
        </div>
      </div>
    </section>
  );
}
