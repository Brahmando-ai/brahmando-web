import { Bot, Server, Workflow, Package } from "lucide-react";

const pillars = [
  {
    icon: Bot,
    title: "AI Agents",
    description:
      "Precision-engineered agents for compliance, finance, research, and operations. Every agent in the Brahmando catalog is versioned, peer-reviewed, and deployed through ManjuLAB.",
  },
  {
    icon: Server,
    title: "MCP Servers",
    description:
      "Model Context Protocol servers that expose domain intelligence as standardised FastAPI endpoints — maintained as part of ManjuLAB's canonical engineering catalog.",
  },
  {
    icon: Workflow,
    title: "Agentic Workflows",
    description:
      "n8n exports and YAML agentic pipelines that orchestrate agents, tools, and data sources into end-to-end automated processes, delivered through ManjuLAB.",
  },
  {
    icon: Package,
    title: "Frameworks & SDKs",
    description:
      "The TypeScript SDK and shared packages that power ManjuLAB delivery — available to enterprise customers under commercial agreements as part of the Brahmando access model.",
  },
];

export function WhatIsBrahmando() {
  return (
    <section className="py-24" id="what-is-brahmando">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="section-title">Four pillars of enterprise intelligence</h2>
          <p className="section-subtitle mx-auto text-center">
            Brahmando is the canonical repository for everything Brahmexa&apos;s engineering arm builds —
            a curated constellation of assets, each precision-crafted to address gaps in what
            modern enterprise can do.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="card flex flex-col gap-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ border: "1px solid var(--border)", background: "var(--accent-dim)" }}
              >
                <p.icon size={19} style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="text-base font-semibold text-slate-100">{p.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
