/** Runtime wiring for agents deployed on the Brahmando GPU stack. */

export type AgentRuntimeType = "edge" | "chat" | "workflow" | "none";

export interface AgentRuntime {
  status: "live" | "preview";
  type: AgentRuntimeType;
  /** Agent alias for POST https://chat.brahmando.com/api/run-agent */
  runAgent?: string;
  /** External app URL (n8n, etc.) */
  externalUrl?: string;
  placeholder?: string;
}

export const EDGE_API =
  process.env.NEXT_PUBLIC_EDGE_API_URL || "https://api.brahmando.com";

/** CORS-safe proxy for brahmando.com agent runner (POST only) */
export const RUN_AGENT_API =
  process.env.NEXT_PUBLIC_RUN_AGENT_API_URL ||
  "https://chat.brahmando.com/api/run-agent";

export const PLATFORM_HEALTH_API =
  process.env.NEXT_PUBLIC_PLATFORM_HEALTH_URL ||
  "https://chat.brahmando.com/api/platform-health";

export const CHAT_STREAM_API =
  process.env.NEXT_PUBLIC_CHAT_API_URL ||
  "https://chat.brahmando.com/api/chat/stream";

export const N8N_URL =
  process.env.NEXT_PUBLIC_N8N_URL || "https://n8n.brahmando.com";

export const AGENT_RUNTIME: Record<string, AgentRuntime> = {
  "compliance-analyzer": {
    status: "live",
    type: "edge",
    runAgent: "compliance-analyzer",
    placeholder:
      "Paste policy text or describe a GDPR/SOC2/HIPAA scenario to analyse…",
  },
  "finance-risk-scorer": {
    status: "live",
    type: "edge",
    runAgent: "finance-risk-scorer",
    placeholder:
      "Describe financial data or portfolio risk scenario to score…",
  },
  "network-topology-analyzer": {
    status: "live",
    type: "edge",
    runAgent: "network-topology-analyzer",
    placeholder:
      "Describe network topology, configs, or anomalies to analyse…",
  },
  hermes: {
    status: "live",
    type: "edge",
    runAgent: "hermes",
    placeholder: "Ask Hermes about SMB ops, WhatsApp, or email workflows…",
  },
  mercury: {
    status: "live",
    type: "edge",
    runAgent: "mercury",
    placeholder: "Ask Mercury about startup strategy, SWOT, or pitch advice…",
  },
  researcher: {
    status: "live",
    type: "edge",
    runAgent: "researcher",
    placeholder: "Ask the Researcher for a deep dive on any topic…",
  },
  "document-summarizer": {
    status: "live",
    type: "edge",
    runAgent: "document-summarizer",
    placeholder: "Paste document text to summarise…",
  },
  "code-reviewer": {
    status: "live",
    type: "edge",
    runAgent: "code-reviewer",
    placeholder: "Paste code snippet for review…",
  },
  "research-assistant": {
    status: "live",
    type: "edge",
    runAgent: "research-assistant",
    placeholder: "Enter a research question with desired depth…",
  },
};

export function getAgentRuntime(agentId: string): AgentRuntime {
  return (
    AGENT_RUNTIME[agentId] ?? {
      status: "live",
      type: "edge",
      runAgent: agentId,
      placeholder: "Ask about this agent…",
    }
  );
}

/** MCP server id → agent detail page */
export const MCP_TO_AGENT: Record<string, string> = {
  "compliance-agent": "compliance-analyzer",
  "finance-agent": "finance-risk-scorer",
  "network-agent": "network-topology-analyzer",
  dikeai: "compliance-analyzer",
};
