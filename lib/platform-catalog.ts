/** Canonical live stack counts for brahmando.com copy — keep in sync with GPU deploy. */

import agentRegistry from "./agents-registry.json";

export const LIVE_MCP_SERVERS = [
  {
    id: "dikeai",
    name: "DikeAI",
    description: "Legal and compliance MCP for US SMBs — tax, startup law, and policy Q&A.",
    port: 8040,
  },
  {
    id: "narada-mcp",
    name: "Narada",
    description: "WhatsApp MCP bridge for agent-driven customer messaging and notifications.",
    port: 8090,
  },
] as const;

export const LIVE_WORKFLOWS = ["Rhythm", "Nandi"] as const;

export const platformStats = {
  agents: agentRegistry.agents.length,
  mcpServers: LIVE_MCP_SERVERS.length,
  workflows: LIVE_WORKFLOWS.length,
} as const;
