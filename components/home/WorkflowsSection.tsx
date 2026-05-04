import Link from "next/link";
import { GitBranch, Zap, Activity } from "lucide-react";

const workflows = [
  {
    icon: GitBranch,
    type: "n8n",
    name: "lead-enrichment-ai",
    description: "Automatically enrich CRM leads using AI research agents and web data.",
  },
  {
    icon: Zap,
    type: "agentic",
    name: "document-review-pipeline",
    description: "Multi-agent pipeline for contract review, risk scoring, and summary generation.",
  },
  {
    icon: GitBranch,
    type: "n8n",
    name: "compliance-report-gen",
    description: "Scheduled compliance scans and auto-generated PDF reports via MCP server.",
  },
  {
    icon: Activity,
    type: "platform",
    name: "rhythm",
    description: "Agent-first workflow automation for SMBs — describe intent in plain English, Rhythm builds the AI execution DAG.",
  },
];

export function WorkflowsSection() {
  return (
    <section className="py-24" id="workflows">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="section-title">Agentic Workflows</h2>
          <p className="section-subtitle mx-auto text-center">
            ManjuLAB R&D pipelines in Brahmando — n8n exports and YAML agentic flows. Delivery and
            operational use are available through ManjuLAB customer or community access.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {workflows.map((wf) => (
            <div key={wf.name} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${wf.type === "n8n" ? "bg-orange-400/20" : wf.type === "platform" ? "bg-violet-400/20" : "bg-cyan-400/15"}`}>
                  <wf.icon size={16} className={wf.type === "n8n" ? "text-orange-300" : wf.type === "platform" ? "text-violet-300" : "text-cyan-200"} />
                </div>
                <span className={`tag ${wf.type === "n8n" ? "bg-orange-50 text-orange-700" : wf.type === "platform" ? "border-violet-300/40 bg-violet-400/20 text-violet-200" : ""}`}>
                  {wf.type}
                </span>
              </div>
              <h3 className="font-mono text-sm font-semibold text-slate-100">{wf.name}</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">{wf.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/workflows" className="btn-secondary">
            Browse workflow catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
