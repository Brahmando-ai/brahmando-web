import { notFound } from "next/navigation";
import { WorkflowDisclaimer } from "@/components/workflows/WorkflowDisclaimer";
import { FlowSteps, WorkflowBackLink } from "@/components/workflows/FlowSteps";
import { allRhythmStaticParams, getRhythmVertical, getRhythmWorkflow } from "@/lib/rhythm-samples";

export function generateStaticParams() {
  return allRhythmStaticParams();
}

type Props = { params: Promise<{ vertical: string; workflowId: string }> };

export default async function RhythmWorkflowDetailPage({ params }: Props) {
  const { vertical: verticalId, workflowId } = await params;
  const vertical = getRhythmVertical(verticalId);
  const workflow = getRhythmWorkflow(verticalId, workflowId);
  if (!vertical || !workflow) notFound();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <WorkflowBackLink href={`/workflows/rhythm/${vertical.id}`} label={vertical.name} />

        <div className="mt-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-300/90">Rhythm · Sample</p>
          <h1 className="section-title mt-2">{workflow.title}</h1>
          <p className="mt-4 text-slate-300 leading-relaxed">{workflow.summary}</p>
        </div>

        <WorkflowDisclaimer />

        <div className="mt-10 space-y-8">
          <section className="card">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Triggers</h2>
            <ul className="mt-3 space-y-1">
              {workflow.triggers.map((t) => (
                <li key={t} className="font-mono text-sm text-cyan-200/90">
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Sample flow</h2>
            <div className="mt-4">
              <FlowSteps steps={workflow.steps} accent="violet" />
            </div>
          </section>

          <section className="card">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Typical outcomes</h2>
            <ul className="mt-3 space-y-2">
              {workflow.outcomes.map((o) => (
                <li key={o} className="flex gap-2 text-sm text-slate-300">
                  <span className="text-violet-400">→</span>
                  {o}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
