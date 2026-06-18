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
  /** Validated example prompts shown as quick-pick chips */
  sampleQuestions?: string[];
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
    sampleQuestions: [
      "Review GDPR compliance for a SaaS that stores customer email and chat logs for 12 months without a published privacy policy.",
      "Check SOC2 readiness: we use AWS, process payment data, and have no formal access review process.",
      "Does this HIPAA scenario pass muster? A clinic stores patient names and appointment notes in a shared Google Sheet.",
    ],
  },
  "finance-risk-scorer": {
    status: "live",
    type: "edge",
    runAgent: "finance-risk-scorer",
    placeholder:
      "Describe financial data or portfolio risk scenario to score…",
    sampleQuestions: [
      "Score risk for a portfolio: 60% US equities, 30% bonds, 10% crypto. Investor profile: moderate.",
      "A startup burns $40k/month with $500k cash. Runway and financial risk flags?",
      "Evaluate credit risk: SMB client, 18 months revenue history, two late payments in the last quarter.",
    ],
  },
  "network-topology-analyzer": {
    status: "live",
    type: "edge",
    runAgent: "network-topology-analyzer",
    placeholder:
      "Describe network topology, configs, or anomalies to analyse…",
    sampleQuestions: [
      "Analyze topology: Cloudflare CDN → nginx load balancer → 4 Kubernetes pods → PostgreSQL RDS. Flag single points of failure.",
      "Review a home-office setup: ISP router, mesh Wi-Fi, VPN to cloud VPC, and a local NAS. Security concerns?",
      "Diagnose intermittent latency: users in India hit a US-hosted API through Cloudflare Tunnel to k3s.",
    ],
  },
  hermes: {
    status: "live",
    type: "edge",
    runAgent: "hermes",
    placeholder: "Ask Hermes about SMB ops, WhatsApp, or email workflows…",
    sampleQuestions: [
      "A customer emailed: 'What AI agents do you offer and how much does it cost?' Draft a professional reply.",
      "Summarize today's inbound messages: 3 pricing questions, 1 support ticket, 2 demo requests.",
      "A WhatsApp lead asked about onboarding timeline for a 10-person team. Suggest a reply.",
    ],
  },
  mercury: {
    status: "live",
    type: "edge",
    runAgent: "mercury",
    placeholder: "Ask Mercury about startup strategy, SWOT, or pitch advice…",
    sampleQuestions: [
      "I'm an MVP-stage B2B SaaS founder selling to SMBs. Give a SWOT analysis and three priorities for the next 90 days.",
      "Help me outline a 10-slide pitch deck for an AI automation platform targeting Indian SMBs.",
      "What go-to-market channels should a bootstrapped SaaS try first with a $2k/month marketing budget?",
    ],
  },
  researcher: {
    status: "live",
    type: "edge",
    runAgent: "researcher",
    placeholder: "Ask the Researcher for a deep dive on any topic…",
    sampleQuestions: [
      "What are the top trends in edge AI and local LLM deployment for startups in 2026?",
      "Deep dive: how do RAG pipelines compare to fine-tuning for domain-specific chatbots?",
      "Research pros and cons of Qdrant vs Pinecone for a self-hosted GPU stack.",
    ],
  },
  "document-summarizer": {
    status: "live",
    type: "edge",
    runAgent: "document-summarizer",
    placeholder: "Paste document text to summarise…",
    sampleQuestions: [
      "Summarize in bullets: Brahmando provides GPU-hosted AI agents, MCP tool servers, LiteLLM routing, Qdrant RAG, and n8n workflows for SMB automation.",
      "Condense this meeting note into key decisions and action items: We agreed to ship chat proxy first, then edge agents, then n8n workflows. Owner: platform team. Deadline: two weeks.",
      "Turn this policy paragraph into a 3-bullet executive summary for non-technical founders.",
    ],
  },
  "code-reviewer": {
    status: "live",
    type: "edge",
    runAgent: "code-reviewer",
    placeholder: "Paste code snippet for review…",
    sampleQuestions: [
      "Review this Python:\ndef get_user(id):\n    return db.execute(f'SELECT * FROM users WHERE id={id}')",
      "Review this FastAPI route for security and error handling:\n@app.get('/data')\ndef data(key: str):\n    return cache[key]",
      "Review this React fetch call:\nfetch(url).then(r => r.json()).then(setData)",
    ],
  },
  "research-assistant": {
    status: "live",
    type: "edge",
    runAgent: "research-assistant",
    placeholder: "Enter a research question with desired depth…",
    sampleQuestions: [
      "Compare Kubernetes versus Docker Compose for a single-GPU server running 10 microservices.",
      "Quick research: best practices for exposing internal k8s services via Cloudflare Tunnel.",
      "Compare managed PostgreSQL vs self-hosted Postgres on a GPU server for an early-stage SaaS.",
    ],
  },
};

export function getAgentRuntime(agentId: string): AgentRuntime {
  return (
    AGENT_RUNTIME[agentId] ?? {
      status: "live",
      type: "edge",
      runAgent: agentId,
      placeholder: "Ask about this agent…",
      sampleQuestions: [],
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
