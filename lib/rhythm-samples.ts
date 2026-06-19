export const WORKFLOW_SAMPLE_DISCLAIMER =
  "Sample workflows only. These illustrations show typical patterns for demonstration and onboarding. Production workflows deployed for Brahmando customers are confidential and private to each business.";

export type RhythmVertical = {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  workflows: RhythmWorkflowSample[];
};

export type RhythmWorkflowSample = {
  id: string;
  title: string;
  summary: string;
  triggers: string[];
  steps: string[];
  outcomes: string[];
};

export const RHYTHM_VERTICALS: RhythmVertical[] = [
  {
    id: "restaurant",
    name: "Food service",
    tagline: "Order-to-table automation for restaurants and QSR",
    icon: "🍽️",
    workflows: [
      {
        id: "order-processing",
        title: "Order intake & validation",
        summary:
          "Accepts a new order, validates line items and payment readiness, and hands off to kitchen and inventory.",
        triggers: ["order.created"],
        steps: [
          "Normalize webhook payload and validate order identity",
          "Check menu availability and pricing rules",
          "Reserve ingredients against current stock",
          "Confirm order with customer notification",
        ],
        outcomes: ["Kitchen queue updated", "Customer confirmation sent"],
      },
      {
        id: "kitchen-execution",
        title: "Kitchen execution",
        summary: "Coordinates prep stations, flags missing ingredients, and marks orders ready for service.",
        triggers: ["kitchen.ticket.opened"],
        steps: [
          "Assign station based on item category",
          "Verify ingredient availability",
          "Track prep timers and quality checkpoints",
          "Release order to expedite / delivery",
        ],
        outcomes: ["Order marked ready", "Exceptions escalated to manager"],
      },
      {
        id: "inventory-management",
        title: "Inventory & reorder",
        summary: "Monitors par levels and raises supplier reorders before service disruption.",
        triggers: ["inventory.below_threshold"],
        steps: ["Evaluate SKU velocity and lead time", "Generate reorder proposal", "Notify procurement", "Log audit trail"],
        outcomes: ["Purchase order draft", "Alert if critical stockout risk"],
      },
      {
        id: "delivery",
        title: "Delivery coordination",
        summary: "Assigns drivers, sends customer tracking updates, and closes the loop on delivery proof.",
        triggers: ["delivery.requested"],
        steps: ["Match driver capacity and route", "Push ETA to customer", "Capture proof of delivery", "Close ticket"],
        outcomes: ["Delivery completed", "Feedback prompt scheduled"],
      },
      {
        id: "feedback",
        title: "Guest feedback & recovery",
        summary: "Captures complaints, routes to management, and tracks service recovery actions.",
        triggers: ["complaint.created", "review.submitted"],
        steps: ["Classify sentiment and severity", "Notify shift manager", "Draft response or compensation offer", "Follow up with guest"],
        outcomes: ["Case resolved", "Trend logged for weekly review"],
      },
    ],
  },
  {
    id: "retail",
    name: "Retail & e-commerce",
    tagline: "Sell, fulfill, and resolve returns at SMB scale",
    icon: "🛒",
    workflows: [
      {
        id: "order-processing",
        title: "Order processing",
        summary: "Validates cart, reserves inventory, and confirms purchase with the buyer.",
        triggers: ["order.placed"],
        steps: ["Validate customer and line items", "Check warehouse stock", "Reserve SKUs", "Send order confirmation"],
        outcomes: ["Fulfillment queue triggered", "Customer receipt issued"],
      },
      {
        id: "payment-processing",
        title: "Payment capture",
        summary: "Handles authorization, capture, and ledger updates with clear failure paths.",
        triggers: ["payment.initiated"],
        steps: ["Validate payment instrument", "Authorize amount", "Capture or void", "Update accounting export"],
        outcomes: ["Payment settled", "Failed payment routed to support"],
      },
      {
        id: "fulfillment",
        title: "Pick, pack & ship",
        summary: "Warehouse workflow from pick list through carrier handoff.",
        triggers: ["shipment.ready"],
        steps: ["Generate pick list", "Pack and weigh carton", "Print shipping label", "Hand off to carrier API"],
        outcomes: ["Tracking number issued", "Customer notified"],
      },
      {
        id: "returns",
        title: "Returns & refunds",
        summary: "Structured RMA flow with inspection and restock decisions.",
        triggers: ["return.requested"],
        steps: ["Validate return window", "Issue RMA label", "Inspect received item", "Refund or exchange", "Restock or write-off"],
        outcomes: ["Customer refunded", "Inventory adjusted"],
      },
      {
        id: "inventory-management",
        title: "Stock monitoring",
        summary: "Proactive low-stock detection across channels.",
        triggers: ["stock.below_minimum"],
        steps: ["Aggregate multi-channel demand", "Forecast depletion date", "Trigger replenishment", "Alert merchandising"],
        outcomes: ["Reorder placed", "Backorder policy applied if needed"],
      },
    ],
  },
  {
    id: "hospital",
    name: "Healthcare operations",
    tagline: "Patient flow and resource coordination (sample patterns)",
    icon: "🏥",
    workflows: [
      {
        id: "patient-intake",
        title: "Patient intake",
        summary: "Registration, assignment, and initial assessment scheduling.",
        triggers: ["patient.admitted"],
        steps: ["Register demographics and insurance", "Assign care team", "Create record shell", "Schedule assessment"],
        outcomes: ["Chart opened", "Staff notified"],
      },
      {
        id: "treatment-flow",
        title: "Treatment pathway",
        summary: "Coordinates orders, documentation, and discharge readiness.",
        triggers: ["care.plan.updated"],
        steps: ["Review orders and allergies", "Execute care tasks", "Document outcomes", "Prepare discharge checklist"],
        outcomes: ["Treatment logged", "Discharge criteria evaluated"],
      },
      {
        id: "resource-management",
        title: "Resource & supply",
        summary: "Medical supply levels with escalation for critical shortages.",
        triggers: ["resource.low"],
        steps: ["Identify affected units", "Calculate burn rate", "Request restock", "Escalate if critical"],
        outcomes: ["Supply chain ticket", "Clinical lead alerted if urgent"],
      },
      {
        id: "alerts",
        title: "Critical alerts",
        summary: "Classifies alerts and routes emergencies to the right on-call role.",
        triggers: ["alert.critical"],
        steps: ["Validate signal source", "Classify severity", "Page responsible team", "Acknowledge and log"],
        outcomes: ["Incident contained", "Post-event review scheduled"],
      },
    ],
  },
  {
    id: "landscaping",
    name: "Field services & landscaping",
    tagline: "Jobs, crews, materials, and completion billing",
    icon: "🌿",
    workflows: [
      {
        id: "job-processing",
        title: "Job scheduling",
        summary: "From customer request to scheduled crew visit with client confirmation.",
        triggers: ["job.requested"],
        steps: ["Scope site requirements", "Estimate duration and materials", "Assign crew window", "Confirm with client"],
        outcomes: ["Job on calendar", "Materials pre-staged"],
      },
      {
        id: "crew-assignment",
        title: "Crew assignment",
        summary: "Matches skills and availability to upcoming jobs.",
        triggers: ["crew.schedule.updated"],
        steps: ["Check certifications and travel time", "Assign lead technician", "Push mobile job pack", "Update dispatch board"],
        outcomes: ["Crew dispatched", "Conflicts flagged"],
      },
      {
        id: "material-inventory",
        title: "Materials & replenishment",
        summary: "Tracks consumables across trucks and central yard.",
        triggers: ["material.low"],
        steps: ["Identify SKU and location", "Calculate reorder quantity", "Notify yard manager", "Adjust job costing"],
        outcomes: ["PO or transfer initiated"],
      },
      {
        id: "job-completion",
        title: "Completion & billing",
        summary: "Photo proof, customer sign-off, and invoice generation.",
        triggers: ["job.completed"],
        steps: ["Capture before/after photos", "Customer sign-off", "Generate invoice", "Archive job folder"],
        outcomes: ["Invoice sent", "Revenue recognized"],
      },
    ],
  },
  {
    id: "generic",
    name: "Cross-industry utilities",
    tagline: "Task routing, notifications, and error handling patterns",
    icon: "⚙️",
    workflows: [
      {
        id: "task-processing",
        title: "Priority task routing",
        summary: "Routes tasks by priority with SLA-aware assignment.",
        triggers: ["task.created"],
        steps: ["Normalize payload", "Score priority", "Assign owner or queue", "Set SLA timer"],
        outcomes: ["Task owned", "Escalation scheduled if breached"],
      },
      {
        id: "notification",
        title: "Omni-channel notification",
        summary: "Formats and delivers messages across email, SMS, and chat apps.",
        triggers: ["notification.send"],
        steps: ["Select template", "Personalize content", "Deliver on preferred channel", "Log delivery status"],
        outcomes: ["Message delivered", "Retry if transient failure"],
      },
      {
        id: "error-handler",
        title: "Error handling & retry",
        summary: "Distinguishes transient faults from fatal errors with operator escalation.",
        triggers: ["error.occurred"],
        steps: ["Classify error type", "Retry with backoff if transient", "Open incident if fatal", "Notify on-call"],
        outcomes: ["Self-healed", "Or incident opened"],
      },
    ],
  },
];

export function getRhythmVertical(id: string): RhythmVertical | undefined {
  return RHYTHM_VERTICALS.find((v) => v.id === id);
}

export function getRhythmWorkflow(verticalId: string, workflowId: string): RhythmWorkflowSample | undefined {
  return getRhythmVertical(verticalId)?.workflows.find((w) => w.id === workflowId);
}

export function allRhythmStaticParams(): { vertical: string; workflowId: string }[] {
  return RHYTHM_VERTICALS.flatMap((v) =>
    v.workflows.map((w) => ({ vertical: v.id, workflowId: w.id }))
  );
}
