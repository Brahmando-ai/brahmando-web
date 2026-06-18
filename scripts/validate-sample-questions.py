#!/usr/bin/env python3
"""Validate sample questions for all live agents via chat proxy."""
import json
import sys
import urllib.request

API = "https://chat.brahmando.com/api/run-agent"
FALLBACK = "I could not retrieve a reliable answer right now"

SAMPLES = {
    "compliance-analyzer": "Review GDPR compliance for a SaaS that stores customer email and chat logs for 12 months without a published privacy policy.",
    "finance-risk-scorer": "Score risk for a portfolio: 60% US equities, 30% bonds, 10% crypto. Investor profile: moderate.",
    "network-topology-analyzer": "Analyze topology: Cloudflare CDN → nginx load balancer → 4 Kubernetes pods → PostgreSQL RDS. Flag single points of failure.",
    "hermes": "A small business customer emailed: 'What AI agents do you offer and how much does it cost?' Draft a professional reply.",
    "mercury": "I'm an MVP-stage B2B SaaS founder selling to SMBs. Give a SWOT analysis and three priorities for the next 90 days.",
    "researcher": "What are the top trends in edge AI and local LLM deployment for startups in 2026?",
    "document-summarizer": "Summarize this in bullet points: Brahmando provides GPU-hosted AI agents, MCP tool servers, LiteLLM model routing, Qdrant RAG, and n8n workflows for SMB automation.",
    "code-reviewer": "Review this Python:\ndef get_user(id):\n    return db.execute(f'SELECT * FROM users WHERE id={id}')",
    "research-assistant": "Compare Kubernetes versus Docker Compose for a single-GPU server running 10 microservices.",
}


def run_agent(agent: str, query: str) -> dict:
    body = json.dumps({"query": query, "agent": agent, "model": "auto"}).encode()
    req = urllib.request.Request(
        API,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read())


def main() -> int:
    failed = 0
    for agent, query in SAMPLES.items():
        try:
            data = run_agent(agent, query)
            out = data.get("result", {}).get("output", "")
            text = out if isinstance(out, str) else json.dumps(out)
            ok = FALLBACK not in text and len(text.strip()) > 40
            status = "OK" if ok else "WEAK"
            if not ok:
                failed += 1
            print(f"[{status}] {agent}: {text[:120].replace(chr(10), ' ')}...")
        except Exception as exc:
            failed += 1
            print(f"[FAIL] {agent}: {exc}")
    return failed


if __name__ == "__main__":
    sys.exit(main())
