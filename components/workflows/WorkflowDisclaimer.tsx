import { AlertTriangle } from "lucide-react";
import { WORKFLOW_SAMPLE_DISCLAIMER } from "@/lib/rhythm-samples";

export function WorkflowDisclaimer() {
  return (
    <div
      className="flex gap-3 rounded-xl border border-amber-400/25 bg-amber-500/5 px-4 py-3 text-sm text-amber-100/90"
      role="note"
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-300" aria-hidden />
      <p>{WORKFLOW_SAMPLE_DISCLAIMER}</p>
    </div>
  );
}
