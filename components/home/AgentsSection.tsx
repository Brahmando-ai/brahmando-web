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
            Browse the AI agents ManjuLAB has published in Brahmando. Each entry is versioned and
            peer-reviewed. Execution, deployment, and integration require a{" "}
            <Link href="/access" style={{ color: "var(--accent)" }} className="underline-offset-2 hover:underline">
              ManjuLAB customer agreement or community program acceptance
            </Link>
            .
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((agent) => (
            <Link key={agent.id} href={`/agents/${agent.id}`} className="card group">
              <div className="mb-3 flex items-start justify-between">
                <span className="tag">{agent.category}</span>
                <span className="font-mono text-xs text-slate-500">{agent.version}</span>
              </div>
              <h3 className="font-semibold text-slate-200 transition-colors group-hover:text-white">
                {agent.name}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">
                {agent.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {agent.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full px-2 py-0.5 text-xs text-slate-400"
                    style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
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
            Browse Full Repository
          </Link>
        </div>
      </div>
    </section>
  );
}
