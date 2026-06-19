import { notFound } from "next/navigation";
import { N8nWorkflowViewer } from "@/components/workflows/N8nWorkflowViewer";
import { WorkflowBackLink } from "@/components/workflows/FlowSteps";
import { WorkflowDisclaimer } from "@/components/workflows/WorkflowDisclaimer";
import {
  allRhythmStaticParams,
  getRhythmVertical,
  getRhythmWorkflow,
  rhythmTemplateUrl,
} from "@/lib/rhythm-verticals";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <WorkflowBackLink href={`/workflows/rhythm/${vertical.id}`} label={vertical.name} />

        <div className="mt-6 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-300/90">
            Rhythm · {workflow.isMaster ? "Master workflow" : "Sub-workflow"} · n8n
          </p>
          <h1 className="section-title mt-2">{workflow.title}</h1>
          <p className="mt-3 max-w-3xl text-slate-300 leading-relaxed">{workflow.description}</p>
          {workflow.events.length > 0 && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-slate-500">
              Events: {workflow.events.join(" · ")}
            </p>
          )}
        </div>

        <N8nWorkflowViewer
          jsonUrl={rhythmTemplateUrl(vertical, workflow)}
          workflowName={workflow.workflowName}
          height={520}
        />

        <WorkflowDisclaimer />
      </div>
    </div>
  );
}
