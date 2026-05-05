import Link from "next/link";
import { GitBranch, Zap, Activity } from "lucide-react";

const workflows = [
  {
    icon: GitBranch,
    type: "n8n",
    name: "lead-enrichment-ai",
    description: "Automatically enrich CRM leads using AI research agents and live web data.",
  },
  {
    icon: Zap,
    type: "agentic",
    name: "document-review-pipeline",
    description: "Multi-agent pipeline for contract review, risk scoring, and executive summary generation.",
  },
  {
    icon: GitBranch,
    type: "n8n",
    name: "compliance-report-gen",
    description: "Scheduled compliance scans with auto-generated PDF audit reports via MCP server.",
  },
  {
    icon: Activity,
    type: "platform",
    name: "rhythm",
    description: "Agent-first workflow automation for SMBs — describe intent in plain English; Rhythm builds the execution DAG.",
  },
];

const typeStyle: Record<string, { bg: string; text: string }> = {
  n8n:      { bg: "rgba(251,146,60,0.15)",  text: "#fdba74" },
  agentic:  { bg: "var(--accent-dim)",       text: "var(--accent)" },
  platform: { bg: "rgba(167,139,250,0.15)", text: "#c4b5fd" },
};

export function WorkflowsSection() {
  return (
    <section className="py-24" id="workflows">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="section-title">Agentic Workflows</h2>
          <p className="section-subtitle mx-auto text-center">
            n8n exports and YAML agentic pipelines that close the automation gap — from raw data
            ingestion to executive reporting, end to end. Available through customer and community
            access programs.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {workflows.map((wf) => {
            const style = typeStyle[wf.type] ?? typeStyle.agentic;
            return (
              <div key={wf.name} className="card">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: style.bg }}
                  >
                    <wf.icon size={15} style={{ color: style.text }} />
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: style.bg, color: style.text }}
                  >
                    {wf.type}
                  </span>
                </div>
                <h3 className="font-mono text-sm font-semibold text-slate-200">{wf.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{wf.description}</p>
              </div>
            );
          })}
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
