import { WorkflowBackLink } from "@/components/workflows/FlowSteps";
import { NandiTicketBoard } from "@/components/workflows/NandiTicketBoard";
import { WorkflowDisclaimer } from "@/components/workflows/WorkflowDisclaimer";

export default function NandiWorkflowsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <WorkflowBackLink href="/workflows" label="All workflows" />

        <div className="mt-6 mb-8">
          <h1 className="section-title">Nandi ticket board</h1>
          <p className="section-subtitle max-w-3xl">
            Interactive support ticketing — drag tickets across states or run sample resolution paths
            (pass, fail, errored → manual, manual → fail, manual → pass via in-progress).
          </p>
        </div>

        <NandiTicketBoard />

        <WorkflowDisclaimer />
      </div>
    </div>
  );
}
