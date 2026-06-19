/** Visitor-facing platform destinations — no internal health URLs. */

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

export type VisitorDestination = {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

/** Cards shown on /platform — each links somewhere useful for site visitors. */
export const VISITOR_DESTINATIONS: VisitorDestination[] = [
  {
    id: "csr",
    icon: "🎓",
    title: "CSR & Education Portal",
    description:
      "Community programs, FAFSA coaching, knowledge-base search, and the 🎓 chat widget for schools and nonprofits.",
    href: "/csr",
  },
  {
    id: "agents",
    icon: "🤖",
    title: `Live agents (${platformStats.agents})`,
    description: "Hermes (SMB copilot) and Mercury (advisor & router) deployed on the GPU stack.",
    href: "/agents",
  },
  {
    id: "mcp",
    icon: "🧩",
    title: `MCP servers (${platformStats.mcpServers})`,
    description: "DikeAI (compliance) and Narada (WhatsApp messaging) — tool endpoints for agents.",
    href: "/mcp-servers",
  },
  {
    id: "workflows",
    icon: "⚡",
    title: `SMB workflows (${platformStats.workflows})`,
    description: "Rhythm for automation and Nandi for lean support ticketing.",
    href: "/workflows",
  },
  {
    id: "chat",
    icon: "💬",
    title: "Brahmando Chat",
    description: "Try Deepak and routed agents in the browser — the public chat front door.",
    href: "https://chat.brahmando.com",
    external: true,
  },
  {
    id: "access",
    icon: "🔑",
    title: "Request access",
    description: "Enterprise deployment or community program enrollment for ManjuLAB assets.",
    href: "/access",
  },
];
