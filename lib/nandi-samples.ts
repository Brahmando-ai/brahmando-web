import { WORKFLOW_SAMPLE_DISCLAIMER } from "./rhythm-samples";

export { WORKFLOW_SAMPLE_DISCLAIMER };

export type NandiPathStep = {
  state: string;
  label: string;
  description: string;
};

export type NandiWorkflowSample = {
  id: string;
  title: string;
  summary: string;
  scenario: string;
  steps: NandiPathStep[];
  finalState: "success" | "failed" | "manual" | "archived";
};

export const NANDI_WORKFLOW_SAMPLES: NandiWorkflowSample[] = [
  {
    id: "pass",
    title: "Standard resolution (pass)",
    summary: "Support issue resolved successfully on first handling.",
    scenario: "Printer driver reinstall fixes the reported issue without escalation.",
    steps: [
      { state: "in_progress", label: "In progress", description: "Agent picks up ticket and begins work." },
      { state: "success", label: "Success", description: "Fix verified with customer; outcome recorded." },
      { state: "archived", label: "Archived", description: "Ticket closed after retention window or manual archive." },
    ],
    finalState: "success",
  },
  {
    id: "fail",
    title: "Unresolved (fail)",
    summary: "Work attempted but issue cannot be fixed within policy or scope.",
    scenario: "Hardware failure requires replacement part that is discontinued.",
    steps: [
      { state: "in_progress", label: "In progress", description: "Agent diagnoses and documents attempts." },
      { state: "failed", label: "Failed", description: "Resolution not possible; customer informed with next steps." },
      { state: "archived", label: "Archived", description: "Ticket archived for reporting and audit." },
    ],
    finalState: "failed",
  },
  {
    id: "errored",
    title: "Errored → manual review",
    summary: "Automation or agent hits an exception; ticket moves to manual review.",
    scenario: "Payment gateway returns an unknown error code requiring human judgment.",
    steps: [
      { state: "in_progress", label: "In progress", description: "Automated or agent workflow runs." },
      { state: "manual", label: "Manual (errored)", description: "Exception flagged; senior agent or owner assigned." },
    ],
    finalState: "manual",
  },
  {
    id: "errored-to-fail",
    title: "Errored → fail",
    summary: "After manual review, issue is closed as failed.",
    scenario: "Manual review confirms data loss; recovery is not feasible.",
    steps: [
      { state: "in_progress", label: "In progress", description: "Initial handling surfaces an error." },
      { state: "manual", label: "Manual", description: "Specialist investigates root cause." },
      { state: "failed", label: "Failed", description: "Decision: cannot restore service to required standard." },
      { state: "archived", label: "Archived", description: "Closed for compliance and reporting." },
    ],
    finalState: "failed",
  },
  {
    id: "errored-to-pass-via-in-progress",
    title: "Errored → pass (via in-progress)",
    summary: "Manual review sends ticket back to active work, then succeeds.",
    scenario: "Wrong account was linked; manual correction allows normal fix to complete.",
    steps: [
      { state: "in_progress", label: "In progress", description: "First attempt hits blocking error." },
      { state: "manual", label: "Manual", description: "Reviewer corrects data or permissions." },
      { state: "in_progress", label: "In progress (again)", description: "Returned to active queue for standard fix." },
      { state: "success", label: "Success", description: "Fix applied and verified." },
      { state: "archived", label: "Archived", description: "Ticket completed and stored." },
    ],
    finalState: "success",
  },
];

export function getNandiWorkflow(id: string): NandiWorkflowSample | undefined {
  return NANDI_WORKFLOW_SAMPLES.find((w) => w.id === id);
}
