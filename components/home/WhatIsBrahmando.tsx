import { Bot, Server, Workflow, Package } from "lucide-react";

const pillars = [
  {
    icon: Bot,
    title: "AI Agents",
    description:
      "Precision-built agents for compliance, finance, research, and operations — each versioned, peer-reviewed, and ready to deploy exactly where your workflows need them most.",
  },
  {
    icon: Server,
    title: "MCP Servers",
    description:
      "Standardised FastAPI endpoints that expose domain intelligence to any AI integration. Plug-and-play intelligence, designed to slot into your stack without bespoke plumbing.",
  },
  {
    icon: Workflow,
    title: "Agentic Workflows",
    description:
      "n8n exports and YAML pipelines that orchestrate agents, tools, and data into end-to-end automation — from raw trigger to executive output, no custom glue required.",
  },
  {
    icon: Package,
    title: "Frameworks & SDKs",
    description:
      "The TypeScript SDK and shared packages that underpin every Brahmando delivery — available to enterprise customers under commercial agreements.",
  },
];

export function WhatIsBrahmando() {
  return (
    <section className="py-24" id="what-is-brahmando">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="section-title">Four pillars of enterprise intelligence</h2>
          <p className="section-subtitle mx-auto text-center">
            Brahmando is the canonical repository for every asset the Brahmexa engineering arm
            builds — a curated constellation of tools, each precision-crafted to close gaps in
            what modern enterprise can do on its own.
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
