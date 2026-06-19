export const NANDI_TRANSITIONS: Record<string, string[]> = {
  open: ["in_progress", "cancelled"],
  in_progress: ["success", "failed", "manual", "cancelled"],
  manual: ["in_progress", "success", "failed"],
  success: ["archived"],
  failed: ["archived"],
  cancelled: ["archived"],
  archived: [],
};

export type NandiColumnId =
  | "open"
  | "in_progress"
  | "manual"
  | "success"
  | "failed"
  | "archived";

export type NandiTicket = {
  id: string;
  title: string;
  customer: string;
  priority: "low" | "normal" | "high";
  status: NandiColumnId;
  summary: string;
  updatedAt: string;
};

export type NandiScenario = {
  id: string;
  title: string;
  description: string;
  ticketId: string;
  path: NandiColumnId[];
  delayMs?: number;
};

export const NANDI_COLUMNS: { id: NandiColumnId; label: string; hint: string }[] = [
  { id: "open", label: "Open", hint: "New tickets awaiting pickup" },
  { id: "in_progress", label: "In progress", hint: "Active work" },
  { id: "manual", label: "Manual review", hint: "Errored — needs human judgment" },
  { id: "success", label: "Success", hint: "Resolved" },
  { id: "failed", label: "Failed", hint: "Could not resolve" },
  { id: "archived", label: "Archived", hint: "Closed per retention policy" },
];

export const INITIAL_TICKETS: NandiTicket[] = [
  {
    id: "TK-1042",
    title: "POS receipt printer offline",
    customer: "C-01 · Maple Diner",
    priority: "high",
    status: "in_progress",
    summary: "Kitchen station 2 cannot print tickets after Windows update.",
    updatedAt: "2 min ago",
  },
  {
    id: "TK-1038",
    title: "Stripe charge declined — unknown code",
    customer: "C-02 · GreenScape LLC",
    priority: "normal",
    status: "manual",
    summary: "Gateway returned processor code Z91; automation paused for review.",
    updatedAt: "18 min ago",
  },
  {
    id: "TK-1031",
    title: "Resident alert sensor false positive",
    customer: "C-03 · Willow Care Home",
    priority: "normal",
    status: "open",
    summary: "Bed sensor triggered twice overnight with no staff escalation.",
    updatedAt: "1 hr ago",
  },
  {
    id: "TK-1024",
    title: "Menu sync to delivery apps",
    customer: "C-01 · Maple Diner",
    priority: "low",
    status: "success",
    summary: "DoorDash catalog refreshed; prices match POS.",
    updatedAt: "Yesterday",
  },
];

export const NANDI_SCENARIOS: NandiScenario[] = [
  {
    id: "pass",
    title: "Standard pass",
    description: "Agent resolves on first handling → success → archive",
    ticketId: "TK-DEMO-PASS",
    path: ["open", "in_progress", "success", "archived"],
  },
  {
    id: "fail",
    title: "Unresolved fail",
    description: "Work attempted but issue cannot be fixed in scope",
    ticketId: "TK-DEMO-FAIL",
    path: ["open", "in_progress", "failed", "archived"],
  },
  {
    id: "errored",
    title: "Errored → manual",
    description: "Automation hits exception; ticket moves to manual review",
    ticketId: "TK-DEMO-ERR",
    path: ["open", "in_progress", "manual"],
  },
  {
    id: "errored-to-fail",
    title: "Manual → fail",
    description: "Specialist confirms recovery is not feasible",
    ticketId: "TK-DEMO-MFAIL",
    path: ["open", "in_progress", "manual", "failed", "archived"],
  },
  {
    id: "errored-to-pass",
    title: "Manual → pass (via in-progress)",
    description: "Reviewer fixes data, ticket returns to queue and succeeds",
    ticketId: "TK-DEMO-MPASS",
    path: ["open", "in_progress", "manual", "in_progress", "success", "archived"],
  },
];

export function canNandiTransition(from: NandiColumnId, to: NandiColumnId): boolean {
  return (NANDI_TRANSITIONS[from] ?? []).includes(to);
}

export function demoTicketForScenario(scenario: NandiScenario): NandiTicket {
  const titles: Record<string, string> = {
    pass: "Driver app login loop",
    fail: "Legacy HVAC controller EOL",
    errored: "Payment gateway unknown error",
    "errored-to-fail": "Database restore — corruption confirmed",
    "errored-to-pass": "Wrong tenant linked to invoice",
  };
  return {
    id: scenario.ticketId,
    title: titles[scenario.id] ?? "Demo ticket",
    customer: "C-02 · Demo tenant",
    priority: "normal",
    status: scenario.path[0],
    summary: scenario.description,
    updatedAt: "Just now",
  };
}
