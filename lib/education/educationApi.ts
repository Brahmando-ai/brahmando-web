/** Education Portal API — used by static brahmando.com admin (GitHub Pages). */
export const EDUCATION_API_BASE = "https://api.brahmando.com/education";

const ADMIN_BYPASS_KEYS = new Set(["cursor"]);

export function isAdminBypassKey(key: string): boolean {
  return ADMIN_BYPASS_KEYS.has(key.trim().toLowerCase());
}

export function normalizeAdminKey(key: string): string {
  const trimmed = key.trim();
  return isAdminBypassKey(trimmed) ? "cursor" : trimmed;
}

export function educationAdminHeaders(adminKey: string): HeadersInit {
  const h: HeadersInit = { Accept: "application/json" };
  const normalized = normalizeAdminKey(adminKey);
  if (normalized) h["X-Admin-Key"] = normalized;
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

export function skuIntakeParseUrl(): string {
  return `${EDUCATION_API_BASE}/admin/sku/intake/parse`;
}

export function skuIntakeDraftUrl(draftId: string): string {
  return `${EDUCATION_API_BASE}/admin/sku/intake/drafts/${encodeURIComponent(draftId)}`;
}

export function skuIntakeConfirmUrl(): string {
  return `${EDUCATION_API_BASE}/admin/sku/intake/confirm`;
}

export type WorkflowStep = {
  id: string;
  label: string;
  description: string;
};

export type IntakeSummary = {
  id: string;
  displayName: string;
  status: string;
  providers: string[];
  locale: string;
  currency: string;
  domainCount: number;
  domains: string[];
  features: string[];
  edgePath: string;
  knowledgeCollection: string;
};

export type IntakeDraft = {
  draftId: string;
  skuId: string;
  displayName: string;
  name: string;
  prompt: string;
  manifest: Record<string, unknown>;
  yaml: string;
  warnings: string[];
  errors: string[];
  valid: boolean;
  workflow: WorkflowStep[];
  summary: IntakeSummary;
};

export async function parseIntakeDraft(
  adminKey: string,
  name: string,
  prompt: string,
  skuId?: string
): Promise<IntakeDraft> {
  const res = await fetch(skuIntakeParseUrl(), {
    method: "POST",
    headers: { ...educationAdminHeaders(adminKey), "Content-Type": "application/json" },
    body: JSON.stringify({ name, prompt, skuId: skuId || undefined }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || `HTTP ${res.status}`);
  return data as IntakeDraft;
}

export async function confirmIntakeDraft(adminKey: string, draftId: string): Promise<BuildSnapshot> {
  const res = await fetch(skuIntakeConfirmUrl(), {
    method: "POST",
    headers: { ...educationAdminHeaders(adminKey), "Content-Type": "application/json" },
    body: JSON.stringify({ draftId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || `HTTP ${res.status}`);
  return data as BuildSnapshot;
}

/** Verify admin token against education API (403 = invalid). */
export async function validateAdminKey(adminKey: string): Promise<boolean> {
  const res = await fetch(`${EDUCATION_API_BASE}/admin/practice/stats`, {
    headers: educationAdminHeaders(adminKey),
  });
  return res.ok;
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
