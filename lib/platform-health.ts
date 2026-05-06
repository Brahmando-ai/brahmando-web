/**
 * Platform Health utilities
 *
 * The health-check endpoint is configurable via the environment variable
 * `NEXT_PUBLIC_PLATFORM_HEALTH_URL`.  When unset it falls back to the
 * Brahmando backend aggregator.
 *
 * Example .env.local:
 *   NEXT_PUBLIC_PLATFORM_HEALTH_URL=https://api.brahmando.com/platform-health
 */

export type ServiceStatus = "checking" | "online" | "protected" | "error" | "offline";

export interface ServiceInfo {
  status: ServiceStatus;
  responseTimeMs?: number;
}

export type StatusMap = Record<string, ServiceInfo>;

/** Raw shape returned by the /platform-health aggregator endpoint. */
export interface PlatformHealthResponse {
  services: Record<string, { status: string; responseTimeMs?: number }>;
}

/** URL of the platform-health aggregator endpoint. */
export const PLATFORM_HEALTH_URL =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_PLATFORM_HEALTH_URL) ||
  "https://api.brahmando.com/platform-health";

/**
 * Map a raw aggregator JSON response to the UI `StatusMap`.
 * Unknown status strings are normalised to `"offline"`.
 */
export function mapHealthResponse(data: PlatformHealthResponse): StatusMap {
  const VALID: Set<ServiceStatus> = new Set([
    "checking",
    "online",
    "protected",
    "error",
    "offline",
  ]);

  return Object.fromEntries(
    Object.entries(data.services).map(([key, info]) => {
      const status: ServiceStatus = VALID.has(info.status as ServiceStatus)
        ? (info.status as ServiceStatus)
        : "offline";
      return [key, { status, responseTimeMs: info.responseTimeMs }];
    })
  );
}
