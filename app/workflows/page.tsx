import { GitBranch, Zap, Activity } from "lucide-react";
import { PartnerLogosBar } from "@/components/branding/PartnerLogosBar";

const n8nWorkflows = [
  {
    name: "lead-enrichment-ai",
    description: "Automatically enrich CRM leads using AI research agents and web data.",
    file: "lead-enrichment-ai.json",
    nodes: 8,
  },
  {
    name: "compliance-report-gen",
    description: "Scheduled compliance scans and auto-generated PDF reports via MCP server.",
    file: "compliance-report-gen.json",
    nodes: 12,
  },
];

const agenticWorkflows = [
  {
    name: "document-review-pipeline",
    description: "Multi-agent pipeline for contract review, risk scoring, and summary generation.",
    file: "document-review-pipeline.yaml",
    steps: 5,
  },
  {
    name: "research-and-report",
    description: "Research a topic using multiple agents, aggregate findings, and generate a report.",
    file: "research-and-report.yaml",
    steps: 4,
  },
];

const rhythmFeatures = [
  "Natural language workflow builder — describe intent, Rhythm generates the DAG",
  "AI-driven branching logic with Ollama integration (llama3/phi3)",
  "Multi-tenant FastAPI backend with async worker queue",
  "React frontend with live DAG visualisation",
  "Built-in WhatsApp, CRM, and email action nodes",
];

export default function WorkflowsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="section-title">Workflows</h1>
          <p className="section-subtitle">
            ManjuLAB R&D workflow catalog in Brahmando — n8n exports and YAML agentic pipelines. Operational
            use and handoff are coordinated through ManjuLAB customer or community access.
          </p>
          <PartnerLogosBar className="mt-8" />
        </div>

        <section className="mt-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400/20">
              <GitBranch size={16} className="text-orange-300" />
            </div>
            <h2 className="text-xl font-semibold text-slate-100">n8n Workflows</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {n8nWorkflows.map((wf) => (
              <div key={wf.name} className="card">
                <div className="flex items-start justify-between mb-3">
                  <span className="tag border-orange-300/40 bg-orange-400/20 text-orange-200">n8n</span>
                  <span className="text-xs text-slate-400">{wf.nodes} nodes</span>
                </div>
                <h3 className="font-mono text-sm font-semibold text-slate-100">{wf.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{wf.description}</p>
                <p className="mt-3 text-xs font-mono text-slate-400">/workflows/n8n/{wf.file}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/20">
              <Zap size={16} className="text-cyan-200" />
            </div>
            <h2 className="text-xl font-semibold text-slate-100">Agentic Workflows</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {agenticWorkflows.map((wf) => (
              <div key={wf.name} className="card">
                <div className="flex items-start justify-between mb-3">
                  <span className="tag">agentic</span>
                  <span className="text-xs text-slate-400">{wf.steps} steps</span>
                </div>
                <h3 className="font-mono text-sm font-semibold text-slate-100">{wf.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{wf.description}</p>
                <p className="mt-3 text-xs font-mono text-slate-400">/workflows/agentic/{wf.file}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/20">
              <Activity size={16} className="text-violet-300" />
            </div>
            <h2 className="text-xl font-semibold text-slate-100">Rhythm — Workflow Automation Platform</h2>
          </div>
          <div className="card">
            <div className="flex items-start justify-between mb-3">
              <span className="tag border-violet-300/40 bg-violet-400/20 text-violet-200">platform</span>
              <span className="text-xs font-mono text-slate-400">ports 8085 / 8200</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Agent-first workflow automation for SMBs. Describe your automation in plain English and Rhythm builds the multi-agent execution DAG — no drag-and-drop needed.
            </p>
            <ul className="space-y-1.5">
              {rhythmFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-mono text-slate-400">/workflows/Rhythm/</p>
          </div>
        </section>
      </div>
    </div>
  );
}
