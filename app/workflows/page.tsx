import { Activity, Ticket } from "lucide-react";
import { PartnerLogosBar } from "@/components/branding/PartnerLogosBar";

const rhythmFeatures = [
  "Natural language workflow builder — describe intent, Rhythm generates the DAG",
  "AI-driven branching logic with Ollama integration (llama3/phi3)",
  "Multi-tenant FastAPI backend with async worker queue",
  "React frontend with live DAG visualisation",
  "Built-in WhatsApp, CRM, and email action nodes",
];

const nandiFeatures = [
  "Register from Mercury, chatbot, or REST — creator, plain-text type, optional attachment (100 KB default)",
  "States: in_progress → success | failed | manual | cancelled → archived",
  "Customer profiles C-01 / C-02 / C-03 with configurable idle archive (default 5 days)",
  "Keyword ticket-type inference — AI only where agents already sit, not forced inside Nandi",
];

export default function WorkflowsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="section-title">Workflows</h1>
          <p className="section-subtitle">
            ManjuLAB SMB workflow products on the Brahmando GPU stack —{" "}
            <strong className="text-slate-100">Rhythm</strong> for automation and{" "}
            <strong className="text-slate-100">Nandi</strong> for support ticketing.
          </p>
          <PartnerLogosBar className="mt-8" />
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/20">
              <Ticket size={16} className="text-amber-200" />
            </div>
            <h2 className="text-xl font-semibold text-slate-100">Nandi — SMB Support Ticketing</h2>
          </div>
          <div className="card">
            <div className="flex items-start justify-between mb-3">
              <span className="tag border-amber-300/40 bg-amber-400/20 text-amber-100">workflow</span>
              <span className="text-xs font-mono text-slate-400">port 8210</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Lean support tickets for small business — simpler than Jira, wired into Mercury and the chatbot when users
              ask for help or report an issue.
            </p>
            <ul className="space-y-1.5">
              {nandiFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-mono text-slate-400">/workflows/Nandi/</p>
          </div>
        </section>

        <section>
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
              Agent-first workflow automation for SMBs. Describe your automation in plain English and Rhythm builds the
              multi-agent execution DAG — no drag-and-drop needed.
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
