import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WorkflowDisclaimer } from "@/components/workflows/WorkflowDisclaimer";
import { WorkflowBackLink } from "@/components/workflows/FlowSteps";
import { NANDI_WORKFLOW_SAMPLES } from "@/lib/nandi-samples";

export default function NandiWorkflowsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <WorkflowBackLink href="/workflows" label="All workflows" />

        <div className="mt-6 mb-8">
          <h1 className="section-title">Nandi ticket paths</h1>
          <p className="section-subtitle max-w-3xl">
            Sample resolution paths for SMB support tickets. States include{" "}
            <code className="text-amber-200/90">in_progress</code>,{" "}
            <code className="text-amber-200/90">manual</code> (errored / needs review),{" "}
            <code className="text-amber-200/90">success</code>, and{" "}
            <code className="text-amber-200/90">failed</code>.
          </p>
        </div>

        <WorkflowDisclaimer />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {NANDI_WORKFLOW_SAMPLES.map((path) => (
            <Link
              key={path.id}
              href={`/workflows/nandi/${path.id}`}
              className="group card block transition-colors hover:border-amber-300/40"
            >
              <h2 className="font-semibold text-slate-100 group-hover:text-amber-100">{path.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{path.summary}</p>
              <p className="mt-3 text-xs text-slate-500 line-clamp-2">{path.scenario}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber-200 group-hover:text-amber-100">
                View path ({path.steps.length} steps)
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
