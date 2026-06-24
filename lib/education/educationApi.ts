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

/** Static manifest index baked into GitHub Pages export at build time. */
export const STATIC_MANIFEST_INDEX = "/admin/manifests/index.json";

export function staticManifestYamlUrl(skuId: string): string {
  return `/admin/manifests/${encodeURIComponent(skuId)}.yaml`;
}
