import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { WorkflowDisclaimer } from "@/components/workflows/WorkflowDisclaimer";
import { WorkflowBackLink } from "@/components/workflows/FlowSteps";
import { getRhythmVertical, RHYTHM_VERTICALS } from "@/lib/rhythm-samples";

export function generateStaticParams() {
  return RHYTHM_VERTICALS.map((v) => ({ vertical: v.id }));
}

type Props = { params: Promise<{ vertical: string }> };

export default async function RhythmVerticalPage({ params }: Props) {
  const { vertical: verticalId } = await params;
  const vertical = getRhythmVertical(verticalId);
  if (!vertical) notFound();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <WorkflowBackLink href="/workflows/rhythm" label="Rhythm industries" />

        <div className="mt-6 mb-8">
          <p className="text-2xl" aria-hidden>
            {vertical.icon}
          </p>
          <h1 className="section-title mt-2">{vertical.name}</h1>
          <p className="section-subtitle max-w-3xl">{vertical.tagline}</p>
        </div>

        <WorkflowDisclaimer />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {vertical.workflows.map((wf) => (
            <Link
              key={wf.id}
              href={`/workflows/rhythm/${vertical.id}/${wf.id}`}
              className="group card block transition-colors hover:border-violet-300/40"
            >
              <h2 className="font-semibold text-slate-100 group-hover:text-violet-100">{wf.title}</h2>
              <p className="mt-2 text-sm text-slate-400 line-clamp-3">{wf.summary}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-wide text-slate-500">
                Triggers: {wf.triggers.join(", ")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-200 group-hover:text-violet-100">
                View sample flow
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
