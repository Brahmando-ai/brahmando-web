import Link from "next/link";
import { Activity, ArrowRight, Ticket } from "lucide-react";
import { PartnerLogosBar } from "@/components/branding/PartnerLogosBar";
import { WorkflowDisclaimer } from "@/components/workflows/WorkflowDisclaimer";
import { RHYTHM_VERTICALS } from "@/lib/rhythm-samples";
import { NANDI_WORKFLOW_SAMPLES } from "@/lib/nandi-samples";

export default function WorkflowsPage() {
  const rhythmCount = RHYTHM_VERTICALS.reduce((n, v) => n + v.workflows.length, 0);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="section-title">Workflows</h1>
          <p className="section-subtitle max-w-3xl">
            ManjuLAB SMB products on Brahmando —{" "}
            <strong className="text-slate-100">Rhythm</strong> ({rhythmCount} sample patterns across{" "}
            {RHYTHM_VERTICALS.length} industries) and{" "}
            <strong className="text-slate-100">Nandi</strong> ({NANDI_WORKFLOW_SAMPLES.length} sample resolution paths).
          </p>
          <PartnerLogosBar className="mt-8" />
        </div>

        <WorkflowDisclaimer />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
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
              Explore sample ticket paths — pass, fail, errored to manual, and recovery flows through in-progress.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-200 group-hover:text-amber-100">
              View {NANDI_WORKFLOW_SAMPLES.length} sample paths
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
                <p className="text-xs text-slate-500">Workflow automation · ports 8085 / 8200</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Browse professional sample patterns for restaurant, retail, healthcare, field service, and shared utilities.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-200 group-hover:text-violet-100">
              Browse {RHYTHM_VERTICALS.length} industry packs
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
