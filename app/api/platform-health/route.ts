import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ── Types ──────────────────────────────────────────────────────────────────

type ServiceStatus = "online" | "protected" | "error" | "offline";

interface ServiceResult {
  status: ServiceStatus;
  responseTimeMs: number;
}

interface ServiceDef {
  key: string;
  /** Primary URL to probe (e.g. /health endpoint). */
  primaryUrl: string;
  /**
   * Fallback URL to try when the primary returns 404
   * (i.e. the /health route doesn't exist yet).
   */
  fallbackUrl?: string;
}

// ── Service definitions ────────────────────────────────────────────────────

const SERVICES: ServiceDef[] = [
  {
    key: "manjulab",
    primaryUrl: "https://manjulab.brahmando.com",
  },
  {
    key: "api",
    primaryUrl: "https://api.brahmando.com/health",
    fallbackUrl: "https://api.brahmando.com/docs",
  },
  {
    key: "workflows",
    primaryUrl: "https://workflows.brahmando.com",
  },
  {
    key: "agents",
    primaryUrl: "https://agents.brahmando.com/health",
    fallbackUrl: "https://agents.brahmando.com",
  },
  {
    key: "ollama",
    primaryUrl: "https://ollama.brahmando.com/api/tags",
  },
  {
    key: "mcp",
    primaryUrl: "https://mcp.brahmando.com/health",
    fallbackUrl: "https://mcp.brahmando.com",
  },
];

const TIMEOUT_MS = 3_000;

// ── Helpers ────────────────────────────────────────────────────────────────

function classifyHttpStatus(httpStatus: number): ServiceStatus {
  if (httpStatus >= 200 && httpStatus <= 399) return "online";
  if (httpStatus === 401 || httpStatus === 403) return "protected";
  if (httpStatus >= 500 && httpStatus <= 599) return "error";
  return "offline"; // 4xx other than 401/403 — endpoint not found / bad request
}

interface ProbeResult {
  status: ServiceStatus;
  responseTimeMs: number;
  /** Raw HTTP status, undefined on network/timeout errors. */
  httpStatus?: number;
}

async function probeUrl(url: string): Promise<ProbeResult> {
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  const start = Date.now();

  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal,
    });
    const responseTimeMs = Date.now() - start;
    return {
      status: classifyHttpStatus(res.status),
      responseTimeMs,
      httpStatus: res.status,
    };
  } catch {
    // Covers DNS errors, connection refused, and AbortError (timeout).
    return { status: "offline", responseTimeMs: Date.now() - start };
  }
}

async function checkService(def: ServiceDef): Promise<[string, ServiceResult]> {
  const primary = await probeUrl(def.primaryUrl);

  // If the /health route returned 404 and a fallback URL exists, try it.
  if (primary.httpStatus === 404 && def.fallbackUrl) {
    const fallback = await probeUrl(def.fallbackUrl);
    return [def.key, { status: fallback.status, responseTimeMs: fallback.responseTimeMs }];
  }

  return [def.key, { status: primary.status, responseTimeMs: primary.responseTimeMs }];
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function GET() {
  const entries = await Promise.all(SERVICES.map(checkService));
  const services: Record<string, ServiceResult> = Object.fromEntries(entries);

  return NextResponse.json(
    { services },
    { headers: { "Cache-Control": "no-store" } },
  );
}
