import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WorkflowDisclaimer } from "@/components/workflows/WorkflowDisclaimer";
import { WorkflowBackLink } from "@/components/workflows/FlowSteps";
import { RHYTHM_VERTICALS } from "@/lib/rhythm-samples";

export default function RhythmWorkflowsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <WorkflowBackLink href="/workflows" label="All workflows" />

        <div className="mt-6 mb-8">
          <h1 className="section-title">Rhythm sample patterns</h1>
          <p className="section-subtitle max-w-3xl">
            Agent-first automation templates organized by industry. Each card opens a professional walkthrough —
            not a raw n8n export.
          </p>
        </div>

        <WorkflowDisclaimer />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RHYTHM_VERTICALS.map((vertical) => (
            <Link
              key={vertical.id}
              href={`/workflows/rhythm/${vertical.id}`}
              className="group card block transition-colors hover:border-violet-300/40"
            >
              <span className="text-2xl" aria-hidden>
                {vertical.icon}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-slate-100 group-hover:text-violet-100">
                {vertical.name}
              </h2>
              <p className="mt-2 text-sm text-slate-400">{vertical.tagline}</p>
              <p className="mt-4 text-xs text-slate-500">
                {vertical.workflows.length} sample workflow{vertical.workflows.length === 1 ? "" : "s"}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-violet-200 group-hover:text-violet-100">
                Explore
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
