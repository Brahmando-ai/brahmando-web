import { NextResponse } from "next/server";

// ── Config ─────────────────────────────────────────────────────────────────

const TIMEOUT_MS = 3_000;

const ENDPOINTS: Array<{ key: string; url: string }> = [
  { key: "manjulab", url: "https://manjulab.brahmando.com" },
  { key: "api",      url: "https://api.brahmando.com/docs" },
  { key: "workflows", url: "https://workflows.brahmando.com" },
  { key: "agents",   url: "https://agents.brahmando.com" },
  { key: "ollama",   url: "https://ollama.brahmando.com/api/tags" },
  { key: "mcp",      url: "https://mcp.brahmando.com" },
];

// ── Types ──────────────────────────────────────────────────────────────────

type ServiceStatus = "online" | "protected" | "offline";

interface ServiceResult {
  status: ServiceStatus;
  responseTimeMs: number;
}

// ── Health probe ───────────────────────────────────────────────────────────

async function probeService(url: string): Promise<ServiceResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const start = Date.now();

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      // HEAD is lighter; fall back handled by status code logic below.
      method: "GET",
      // Prevent Next.js from caching these revalidation-heavy requests.
      cache: "no-store",
    });

    const responseTimeMs = Date.now() - start;

    if (res.status === 401 || res.status === 403) {
      return { status: "protected", responseTimeMs };
    }

    if (res.status >= 200 && res.status < 400) {
      return { status: "online", responseTimeMs };
    }

    return { status: "offline", responseTimeMs };
  } catch {
    return { status: "offline", responseTimeMs: Date.now() - start };
  } finally {
    clearTimeout(timer);
  }
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function GET() {
  const results = await Promise.all(
    ENDPOINTS.map(async ({ key, url }) => {
      const result = await probeService(url);
      return [key, result] as const;
    })
  );

  return NextResponse.json(
    { services: Object.fromEntries(results) },
    {
      headers: {
        // Prevent stale health data from being cached.
        "Cache-Control": "no-store",
      },
    }
  );
}
