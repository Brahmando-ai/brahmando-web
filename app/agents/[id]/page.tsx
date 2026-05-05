import Link from "next/link";
import { notFound } from "next/navigation";
import agentRegistry from "@/lib/agents-registry.json";

export function generateStaticParams() {
  return agentRegistry.agents.map((a) => ({ id: a.id }));
}

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = agentRegistry.agents.find((a) => a.id === params.id);
  if (!agent) notFound();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-2">
          <span className="tag">{agent.category}</span>
        </div>
        <h1 className="mt-3 text-4xl font-bold text-slate-100">{agent.name}</h1>
        <p className="mt-3 text-lg text-slate-300">{agent.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {agent.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-300/20 bg-slate-900/55 px-2.5 py-1 text-xs text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: "Version", value: agent.version },
            { label: "Author", value: agent.author },
            { label: "MCP Server", value: agent.mcpServer ?? "Standalone" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-slate-300/20 bg-slate-900/55 p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider">{m.label}</p>
              <p className="mt-1 font-mono text-sm text-slate-100">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-6">
          {(["inputSchema", "outputSchema"] as const).map((key) => (
            <div key={key}>
              <h2 className="mb-3 text-lg font-semibold text-slate-100">
                {key === "inputSchema" ? "Input Schema" : "Output Schema"}
              </h2>
              <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs overflow-x-auto">
                {JSON.stringify(agent[key], null, 2)}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-amber-300/40 bg-amber-400/10 p-4 text-sm text-amber-100">
          <strong>Preview:</strong> This page is a static catalog entry. Execution, backend connectivity,
          and operational documentation are provided through a ManjuLAB customer agreement or the
          community access program.{" "}
          <Link href="/access" className="font-semibold text-amber-50 underline-offset-2 hover:underline">
            Request access
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
