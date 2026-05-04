import { Bot, Server, Workflow, Package } from "lucide-react";

const pillars = [
  {
    icon: Bot,
    title: "AI Agents",
    description:
      "ManjuLAB R&D agents for compliance, finance, research, and more — versioned and published in Brahmando for licensed customer and community use.",
  },
  {
    icon: Server,
    title: "MCP Servers",
    description:
      "Model Context Protocol servers that expose domain intelligence as callable endpoints, maintained as part of ManjuLAB engineering catalog in Brahmando.",
  },
  {
    icon: Workflow,
    title: "Agentic workflows",
    description:
      "n8n exports and YAML pipelines that orchestrate agents and tools — documented and delivered through ManjuLAB, not as anonymous public downloads.",
  },
  {
    icon: Package,
    title: "Frameworks & SDKs",
    description:
      "Shared components and the TypeScript SDK used inside ManjuLAB delivery; available to customers under agreement as part of the Brahmando access model.",
  },
];

export function WhatIsBrahmando() {
  return (
    <section className="py-24" id="what-is-brahmando">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="section-title">What&apos;s in the Brahmando catalog?</h2>
          <p className="section-subtitle mx-auto text-center">
            Four categories of ManjuLAB R&D output, organised in one place so customers and community
            partners know what exists — access and deployment always go through ManjuLAB.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="card flex flex-col gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-400/10">
                <p.icon size={20} className="text-cyan-200" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">{p.title}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
