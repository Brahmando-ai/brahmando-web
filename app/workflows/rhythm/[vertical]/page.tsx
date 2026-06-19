import { notFound } from "next/navigation";
import { RhythmVerticalExplorer } from "@/components/workflows/RhythmVerticalExplorer";
import { WorkflowBackLink } from "@/components/workflows/FlowSteps";
import { WorkflowDisclaimer } from "@/components/workflows/WorkflowDisclaimer";
import { getRhythmVertical, RHYTHM_VERTICALS } from "@/lib/rhythm-verticals";

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

        <RhythmVerticalExplorer vertical={vertical} />

        <WorkflowDisclaimer />
      </div>
    </div>
  );
}
