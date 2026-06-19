import { WORKFLOW_SAMPLE_DISCLAIMER } from "@/lib/rhythm-verticals";

export function WorkflowDisclaimer() {
  return (
    <p className="mt-10 text-center text-xs text-slate-600" role="note">
      {WORKFLOW_SAMPLE_DISCLAIMER}
    </p>
  );
}

export function WorkflowDisclaimerInline() {
  return (
    <p className="text-xs text-slate-600" role="note">
      {WORKFLOW_SAMPLE_DISCLAIMER}
    </p>
  );
}
