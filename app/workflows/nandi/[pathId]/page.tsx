import { notFound } from "next/navigation";
import { WorkflowDisclaimer } from "@/components/workflows/WorkflowDisclaimer";
import { NandiStatePath, WorkflowBackLink } from "@/components/workflows/FlowSteps";
import { getNandiWorkflow, NANDI_WORKFLOW_SAMPLES } from "@/lib/nandi-samples";

export function generateStaticParams() {
  return NANDI_WORKFLOW_SAMPLES.map((p) => ({ pathId: p.id }));
}

type Props = { params: Promise<{ pathId: string }> };

export default async function NandiPathDetailPage({ params }: Props) {
  const { pathId } = await params;
  const path = getNandiWorkflow(pathId);
  if (!path) notFound();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <WorkflowBackLink href="/workflows/nandi" label="Nandi paths" />

        <div className="mt-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">Nandi · Sample path</p>
          <h1 className="section-title mt-2">{path.title}</h1>
          <p className="mt-4 text-slate-300 leading-relaxed">{path.summary}</p>
        </div>

        <WorkflowDisclaimer />

        <section className="mt-10 card">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Example scenario</h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">{path.scenario}</p>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">State transitions</h2>
          <NandiStatePath steps={path.steps} />
        </section>

        <p className="mt-8 text-xs text-slate-500">
          Final state: <span className="font-mono text-amber-200/90">{path.finalState}</span>
          {path.steps.some((s) => s.state === "archived") ? " (then archived per retention policy)" : ""}
        </p>
      </div>
    </div>
  );
}
