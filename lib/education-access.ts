export type EducationAccessTier = "public" | "community" | "customer";

const STORAGE_KEY = "brahmando-education-tier";

/** ManjuLAB customer (paid) tier unlocks export. Community/public are read-only in chat. */
export function getEducationAccessTier(): EducationAccessTier {
  if (typeof window === "undefined") return "public";

  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("tier") || params.get("access");
  if (fromUrl === "customer" || fromUrl === "paid") return "customer";
  if (fromUrl === "community") return "community";

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "customer" || saved === "community") return saved;

  return "public";
}

export function canExportEducationContent(): boolean {
  return getEducationAccessTier() === "customer";
}

export function setEducationAccessTier(tier: EducationAccessTier): void {
  if (typeof window === "undefined") return;
  if (tier === "public") localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, tier);
}
