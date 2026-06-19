export const WORKFLOW_SAMPLE_DISCLAIMER =
  "Sample workflows only. Production workflows are confidential to each customer.";

export type RhythmSubWorkflow = {
  id: string;
  file: string;
  workflowName: string;
  title: string;
  description: string;
  events: string[];
  isMaster?: boolean;
};

export type RhythmVertical = {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  /** Path under /public/rhythm/ */
  templateDir: string;
  master: RhythmSubWorkflow;
  subWorkflows: RhythmSubWorkflow[];
};

const restaurantSubs: Omit<RhythmSubWorkflow, "isMaster">[] = [
  {
    id: "order-processing",
    file: "order-processing.json",
    workflowName: "Brahmexa-Restaurant-OrderProcessing",
    title: "Order processing",
    description: "Validates order, sends to kitchen, updates inventory, processes payment",
    events: ["order.created"],
  },
  {
    id: "kitchen-execution",
    file: "kitchen-execution.json",
    workflowName: "Brahmexa-Restaurant-KitchenExecution",
    title: "Kitchen execution",
    description: "Checks ingredients, cooks food, marks order ready",
    events: ["kitchen.completed"],
  },
  {
    id: "inventory-management",
    file: "inventory-management.json",
    workflowName: "Brahmexa-Restaurant-InventoryManagement",
    title: "Inventory management",
    description: "Monitors stock levels and triggers reorders when threshold is breached",
    events: ["inventory.low"],
  },
  {
    id: "delivery",
    file: "delivery.json",
    workflowName: "Brahmexa-Restaurant-Delivery",
    title: "Delivery",
    description: "Assigns driver, notifies customer, tracks delivery to completion",
    events: ["delivery.assigned"],
  },
  {
    id: "feedback",
    file: "feedback.json",
    workflowName: "Brahmexa-Restaurant-Feedback",
    title: "Feedback & recovery",
    description: "Logs complaints, notifies manager, sends resolution to customer",
    events: ["complaint.created"],
  },
];

const landscapingSubs: Omit<RhythmSubWorkflow, "isMaster">[] = [
  {
    id: "job-processing",
    file: "job-processing.json",
    workflowName: "Brahmexa-Landscaping-JobProcessing",
    title: "Job processing",
    description: "Validates job request, assigns crew, schedules work, confirms with client",
    events: ["job.requested"],
  },
  {
    id: "crew-assignment",
    file: "crew-assignment.json",
    workflowName: "Brahmexa-Landscaping-CrewAssignment",
    title: "Crew assignment",
    description: "Checks crew availability, selects and notifies crew, updates schedule",
    events: ["crew.assigned"],
  },
  {
    id: "material-inventory",
    file: "material-inventory.json",
    workflowName: "Brahmexa-Landscaping-MaterialInventory",
    title: "Material inventory",
    description: "Monitors material stock and places reorders when levels drop",
    events: ["material.low"],
  },
  {
    id: "job-completion",
    file: "job-completion.json",
    workflowName: "Brahmexa-Landscaping-JobCompletion",
    title: "Job completion & billing",
    description: "Verifies job completion, captures photos, invoices client, closes job",
    events: ["job.completed"],
  },
];

const nursingHomeSubs: Omit<RhythmSubWorkflow, "isMaster">[] = [
  {
    id: "patient-intake",
    file: "patient-intake.json",
    workflowName: "Brahmexa-Hospital-PatientIntake",
    title: "Resident intake",
    description: "Registers resident, assigns care team, creates record, schedules assessment",
    events: ["patient.admitted"],
  },
  {
    id: "treatment-flow",
    file: "treatment-flow.json",
    workflowName: "Brahmexa-Hospital-TreatmentFlow",
    title: "Care pathway",
    description: "Assesses resident, assigns care plan, administers care, logs outcomes",
    events: ["patient.admitted", "patient.discharged"],
  },
  {
    id: "resource-management",
    file: "resource-management.json",
    workflowName: "Brahmexa-Hospital-ResourceManagement",
    title: "Supply management",
    description: "Monitors medical supply levels and triggers restock requests",
    events: ["resource.low"],
  },
  {
    id: "alerts",
    file: "alerts.json",
    workflowName: "Brahmexa-Hospital-Alerts",
    title: "Critical alerts",
    description: "Detects and classifies alerts, escalates critical events to on-call staff",
    events: ["alert.critical"],
  },
];

function masterFor(
  vertical: string,
  label: string,
  description: string,
  events: string[]
): RhythmSubWorkflow {
  return {
    id: "dispatcher",
    file: "dispatcher.json",
    workflowName: `Brahmexa-${label}-Dispatcher`,
    title: "Order-to-cash master workflow",
    description,
    events,
    isMaster: true,
  };
}

export const RHYTHM_VERTICALS: RhythmVertical[] = [
  {
    id: "restaurant",
    name: "Restaurant",
    tagline: "Order-to-table automation — intake, kitchen, inventory, delivery, and guest recovery",
    icon: "🍽️",
    templateDir: "restaurant",
    master: masterFor(
      "restaurant",
      "Restaurant",
      "Master n8n dispatcher routes events to domain sub-workflows across the full order-to-cash cycle",
      ["order.created", "inventory.low", "complaint.created", "kitchen.completed", "delivery.assigned"]
    ),
    subWorkflows: restaurantSubs.map((w) => ({ ...w })),
  },
  {
    id: "landscaping",
    name: "Landscaping",
    tagline: "Field service order-to-cash — jobs, crews, materials, and completion billing",
    icon: "🌿",
    templateDir: "landscaping",
    master: masterFor(
      "landscaping",
      "Landscaping",
      "Master n8n dispatcher orchestrates job intake through crew dispatch, materials, and invoicing",
      ["job.requested", "crew.assigned", "material.low", "job.completed"]
    ),
    subWorkflows: landscapingSubs.map((w) => ({ ...w })),
  },
  {
    id: "nursing-home",
    name: "Nursing home",
    tagline: "Resident care operations — intake, care pathways, supplies, and critical alerts",
    icon: "🏠",
    templateDir: "nursing-home",
    master: masterFor(
      "nursing-home",
      "Hospital",
      "Master n8n dispatcher routes resident and facility events across the care operations lifecycle",
      ["patient.admitted", "patient.discharged", "resource.low", "alert.critical"]
    ),
    subWorkflows: nursingHomeSubs.map((w) => ({ ...w })),
  },
];

export function rhythmTemplateUrl(vertical: RhythmVertical, workflow: RhythmSubWorkflow): string {
  return `/rhythm/${vertical.templateDir}/${workflow.file}`;
}

export function getRhythmVertical(id: string): RhythmVertical | undefined {
  return RHYTHM_VERTICALS.find((v) => v.id === id);
}

export function getRhythmWorkflow(verticalId: string, workflowId: string): RhythmSubWorkflow | undefined {
  const vertical = getRhythmVertical(verticalId);
  if (!vertical) return undefined;
  if (vertical.master.id === workflowId) return vertical.master;
  return vertical.subWorkflows.find((w) => w.id === workflowId);
}

export function allRhythmWorkflows(vertical: RhythmVertical): RhythmSubWorkflow[] {
  return [vertical.master, ...vertical.subWorkflows];
}

export function allRhythmStaticParams(): { vertical: string; workflowId: string }[] {
  return RHYTHM_VERTICALS.flatMap((v) =>
    allRhythmWorkflows(v).map((w) => ({ vertical: v.id, workflowId: w.id }))
  );
}
