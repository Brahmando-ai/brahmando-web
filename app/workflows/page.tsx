import Link from "next/link";
import { Activity, ArrowRight, Megaphone, Ticket, Wrench } from "lucide-react";
import { PartnerLogosBar } from "@/components/branding/PartnerLogosBar";
import { WorkflowDisclaimer } from "@/components/workflows/WorkflowDisclaimer";
import { RHYTHM_SMB_VERTICALS_SUMMARY, RHYTHM_VERTICALS } from "@/lib/rhythm-verticals";

export default function WorkflowsPage() {
  const subCount = RHYTHM_VERTICALS.reduce((n, v) => n + v.subWorkflows.length, 0);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="section-title">Workflows</h1>
          <p className="section-subtitle max-w-3xl">
            ManjuLAB SMB products on Brahmando —{" "}
            <strong className="text-slate-100">Rhythm</strong> ({RHYTHM_VERTICALS.length} SMB industry verticals,{" "}
            {subCount} business-process sub-workflows),{" "}
            <strong className="text-slate-100">Nandi</strong> (support ticketing), and{" "}
            <strong className="text-slate-100">Reach</strong> (marketing), and{" "}
            <strong className="text-slate-100">HVAC</strong> (L1/L2/L3 support portal).
          </p>
          <p className="mt-3 max-w-3xl text-sm text-slate-500">{RHYTHM_SMB_VERTICALS_SUMMARY}</p>
          <PartnerLogosBar className="mt-8" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/workflows/rhythm"
            className="group card block transition-colors hover:border-violet-300/40"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-400/20">
                <Activity size={20} className="text-violet-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100 group-hover:text-violet-100">Rhythm</h2>
                <p className="text-xs text-slate-500">n8n order-to-cash · 4 SMB verticals</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Restaurant, landscaping, nursing home, and online store — master dispatcher plus sub-workflows on n8n canvas.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-200 group-hover:text-violet-100">
              Browse {RHYTHM_VERTICALS.length} industry packs
              <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            href="/workflows/nandi"
            className="group card block transition-colors hover:border-amber-300/40"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/20">
                <Ticket size={20} className="text-amber-200" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100 group-hover:text-amber-100">Nandi</h2>
                <p className="text-xs text-slate-500">SMB support ticketing · port 8210</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Drag-and-drop ticket board with live state transitions.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-200 group-hover:text-amber-100">
              Open ticket board
              <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            href="/workflows/marketing"
            className="group card block transition-colors hover:border-cyan-300/40"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/20">
                <Megaphone size={20} className="text-cyan-200" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100 group-hover:text-cyan-100">Reach</h2>
                <p className="text-xs text-slate-500">Agentic marketing · port 8220</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Local SMB digital marketing — FB, Instagram, LinkedIn, email, YouTube, and local group outreach with owner approval via WhatsApp.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 group-hover:text-cyan-100">
              View marketing orchestrator
              <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            href="/hvac"
            className="group card block transition-colors hover:border-orange-300/40"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-400/20">
                <Wrench size={20} className="text-orange-200" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100 group-hover:text-orange-100">HVAC Support</h2>
                <p className="text-xs text-slate-500">L1 / L2 / L3 · port 8130</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Live RAG queries, technician guidance, escalation + Nandi tickets, L2/L3 feedback loop.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-orange-200 group-hover:text-orange-100">
              Open support portal
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>

        <WorkflowDisclaimer />
      </div>
    </div>
  );
}
