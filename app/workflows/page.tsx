import Link from "next/link";
import { Activity, ArrowRight, Ticket } from "lucide-react";
import { PartnerLogosBar } from "@/components/branding/PartnerLogosBar";
import { WorkflowDisclaimer } from "@/components/workflows/WorkflowDisclaimer";
import { RHYTHM_VERTICALS } from "@/lib/rhythm-verticals";

export default function WorkflowsPage() {
  const subCount = RHYTHM_VERTICALS.reduce((n, v) => n + v.subWorkflows.length, 0);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="section-title">Workflows</h1>
          <p className="section-subtitle max-w-3xl">
            ManjuLAB SMB products on Brahmando —{" "}
            <strong className="text-slate-100">Rhythm</strong> (n8n order-to-cash packs for{" "}
            {RHYTHM_VERTICALS.length} industries, {subCount} business-process sub-workflows) and{" "}
            <strong className="text-slate-100">Nandi</strong> (live interactive ticket board).
          </p>
          <PartnerLogosBar className="mt-8" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
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
              Drag-and-drop ticket board with live state transitions — not slide bullets.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-200 group-hover:text-amber-100">
              Open ticket board
              <ArrowRight size={14} />
            </span>
          </Link>

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
                <p className="text-xs text-slate-500">n8n workflow automation · local templates</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Restaurant, landscaping, and nursing home verticals — master dispatcher plus sub-workflows on n8n canvas.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-200 group-hover:text-violet-100">
              Browse {RHYTHM_VERTICALS.length} industry packs
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>

        <WorkflowDisclaimer />
      </div>
    </div>
  );
}
