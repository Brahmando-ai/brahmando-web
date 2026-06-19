/** HVAC Support API — proxied via api.brahmando.com/hvac */

const FALLBACK_BASES = [
  "/api/hvac",
  "https://api.brahmando.com/hvac",
];

export function hvacApiBases(): string[] {
  if (typeof window === "undefined") {
    const env = process.env.NEXT_PUBLIC_HVAC_API_URL;
    return env ? [env.replace(/\/$/, "")] : [FALLBACK_BASES[1]!];
  }
  const env = process.env.NEXT_PUBLIC_HVAC_API_URL;
  if (env) return [env.replace(/\/$/, "")];
  return [...FALLBACK_BASES];
}

export type SupportLevel = "L1" | "L2" | "L3";
export type AnswerSource = "kb" | "openrouter";

export type HvacBrand = {
  id: string;
  name: string;
  models: string[];
  in_kb: boolean;
  custom?: boolean;
};

export type HvacBrandCatalog = {
  brands: HvacBrand[];
  note: string;
};

export type HvacEquipment = {
  brand_id: string;
  brand_other?: string;
  model?: string;
};

export type HvacQueryResponse = {
  session_id: string;
  query_id: string;
  level: SupportLevel;
  answer: string;
  citations: string[];
  escalated: boolean;
  ticket_id?: string | null;
  suggest_level?: SupportLevel | null;
  answer_source?: AnswerSource;
  brand?: string | null;
  model?: string | null;
  kb_confidence?: number | null;
};

export type HvacFeedbackResponse = {
  id: string;
  ingested_to_kb: boolean;
  message: string;
};

export type HvacHealthResponse = {
  status: string;
  service: string;
  version: string;
  kb_points: number;
  collection: string;
  openrouter_configured?: boolean;
};

async function getJson<T>(path: string): Promise<T> {
  let lastError: Error | null = null;
  for (const base of hvacApiBases()) {
    try {
      const res = await fetch(`${base}${path}`, { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text.slice(0, 200)}`);
      }
      return (await res.json()) as T;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastError ?? new Error("HVAC API unreachable");
}

export async function fetchHvacHealth(): Promise<HvacHealthResponse> {
  return getJson<HvacHealthResponse>("/health");
}

export async function fetchHvacBrands(): Promise<HvacBrandCatalog> {
  return getJson<HvacBrandCatalog>("/catalog/brands");
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  let lastError: Error | null = null;
  for (const base of hvacApiBases()) {
    try {
      const res = await fetch(`${base}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text.slice(0, 200)}`);
      }
      return (await res.json()) as T;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastError ?? new Error("HVAC API unreachable");
}

export async function createHvacSession(level: SupportLevel, customerId = "C-02") {
  return postJson<{ id: string; level: string; customer_id: string }>("/sessions", {
    level,
    customer_id: customerId,
  });
}

export async function queryHvac(
  message: string,
  sessionId: string | null,
  level: SupportLevel,
  equipment: HvacEquipment = { brand_id: "generic" },
  customerId = "C-02"
): Promise<HvacQueryResponse> {
  return postJson<HvacQueryResponse>("/query", {
    message,
    session_id: sessionId,
    level,
    customer_id: customerId,
    brand_id: equipment.brand_id,
    brand_other: equipment.brand_other || null,
    model: equipment.model?.trim() || null,
  });
}

export async function submitHvacFeedback(payload: {
  session_id: string;
  query_id: string;
  rating: number;
  helpful: boolean;
  correction: string;
  technician_id?: string;
}): Promise<HvacFeedbackResponse> {
  return postJson<HvacFeedbackResponse>("/feedback", payload);
}
