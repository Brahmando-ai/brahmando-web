/** Education Portal API — used by static brahmando.com admin (GitHub Pages). */
export const EDUCATION_API_BASE = "https://api.brahmando.com/education";

export function educationAdminHeaders(adminKey: string): HeadersInit {
  const h: HeadersInit = { Accept: "application/json" };
  if (adminKey) h["X-Admin-Key"] = adminKey;
  return h;
}

export function skuManifestsUrl(): string {
  return `${EDUCATION_API_BASE}/admin/sku/manifests`;
}

export function skuManifestUrl(skuId: string): string {
  return `${EDUCATION_API_BASE}/admin/sku/manifests/${encodeURIComponent(skuId)}`;
}

export function skuGenerateUrl(skuId: string): string {
  return `${EDUCATION_API_BASE}/admin/sku/manifests/${encodeURIComponent(skuId)}/generate`;
}

export function skuBuildUrl(skuId: string): string {
  return `${EDUCATION_API_BASE}/admin/sku/manifests/${encodeURIComponent(skuId)}/build`;
}

export function skuBuildStatusUrl(buildId: string): string {
  return `${EDUCATION_API_BASE}/admin/sku/builds/${encodeURIComponent(buildId)}`;
}

export function skuBuildListUrl(skuId?: string): string {
  const base = `${EDUCATION_API_BASE}/admin/sku/builds`;
  return skuId ? `${base}?sku=${encodeURIComponent(skuId)}` : base;
}

/** Static manifest index baked into GitHub Pages export at build time. */
export const STATIC_MANIFEST_INDEX = "/admin/manifests/index.json";

export function staticManifestYamlUrl(skuId: string): string {
  return `/admin/manifests/${encodeURIComponent(skuId)}.yaml`;
}

export type BuildStep = {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error" | "skipped";
  detail: string;
};

export type BuildEvent = {
  ts: string;
  level: string;
  message: string;
};

export type BuildSnapshot = {
  id: string;
  skuId: string;
  status: "queued" | "running" | "done" | "error";
  percent: number;
  steps: BuildStep[];
  events: BuildEvent[];
  error?: string;
  result?: { ok?: boolean; written?: string[] };
};
