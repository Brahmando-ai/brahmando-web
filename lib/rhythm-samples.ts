/** @deprecated Use @/lib/rhythm-verticals */
export {
  WORKFLOW_SAMPLE_DISCLAIMER,
  RHYTHM_VERTICALS,
  getRhythmVertical,
  getRhythmWorkflow,
  allRhythmStaticParams,
  type RhythmVertical,
} from "@/lib/rhythm-verticals";

export type RhythmWorkflowSample = {
  id: string;
  title: string;
  summary: string;
  triggers: string[];
  steps: string[];
  outcomes: string[];
};
