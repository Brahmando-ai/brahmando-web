/** Education Portal API — proxied via chat.brahmando.com */

export const EDUCATION_API =
  process.env.NEXT_PUBLIC_EDUCATION_API_URL ||
  "https://chat.brahmando.com/api/education";

export type EducationActor = "student" | "teacher" | "school" | "coaching_center";

export type KnowledgeFilters = {
  syllabus_board?: string;
  grade?: string;
  board_exam?: string;
  competitive_track?: string;
  subject?: string;
  content_type?: string;
  exam_body?: string;
  exam_name?: string;
  exam_year?: number;
  topic?: string;
  include_crawl?: boolean;
};

export type KnowledgeHit = {
  text: string;
  score: number;
  source: string;
  rel_path?: string;
  topic?: string;
  syllabus_board?: string | null;
  grade?: string | null;
  board_exam?: string | null;
  competitive_track?: string | null;
  subject?: string | null;
  content_type?: string | null;
  exam_body?: string | null;
  exam_name?: string | null;
  exam_year?: number | null;
  chunk?: number;
};

export type TaxonomyDimension = {
  label: string;
  values: string[];
};

export type TaxonomyResponse = {
  metadata_version: number;
  dimensions: Record<string, TaxonomyDimension>;
  facets?: Record<string, Record<string, number>>;
  dataset_notes?: Record<string, string>;
};

export type ActorChatResponse = {
  actor?: string;
  module?: string;
  answer?: string;
  analysis?: string;
  content?: string;
  plan?: string;
  lesson_plan?: string;
  matches?: string;
  evaluation?: string;
  checklist?: string;
  guidance?: string;
  sources_used?: string[];
  detail?: string;
};

async function educationFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${EDUCATION_API.replace(/\/$/, "")}${path}`, {
      ...init,
      headers: { ...init?.headers, Accept: "application/json" },
    });
  } catch {
    throw new Error(
      "Could not reach Education Portal (network). The API may be starting up — try again shortly."
    );
  }
  let data: T & { detail?: string };
  try {
    data = (await res.json()) as T & { detail?: string };
  } catch {
    throw new Error(`Education Portal returned invalid response (HTTP ${res.status}).`);
  }
  if (!res.ok) {
    throw new Error(
      typeof data.detail === "string" ? data.detail : `Request failed (HTTP ${res.status})`
    );
  }
  return data;
}

export async function getKnowledgeTaxonomy(): Promise<TaxonomyResponse> {
  return educationFetch<TaxonomyResponse>("/knowledge/taxonomy");
}

export async function searchKnowledge(
  query: string,
  filters: KnowledgeFilters = {},
  topK = 12
): Promise<{ query: string; filters: KnowledgeFilters; count: number; results: KnowledgeHit[] }> {
  return educationFetch("/knowledge/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: topK, filters }),
  });
}

export async function postActorChat(
  actor: EducationActor,
  message: string,
  context: Record<string, unknown> = {}
): Promise<ActorChatResponse> {
  return educationFetch<ActorChatResponse>("/actors/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actor, message, context }),
  });
}

export function formatEducationResponse(data: ActorChatResponse): string {
  return (
    data.answer ||
    data.analysis ||
    data.content ||
    data.plan ||
    data.lesson_plan ||
    data.matches ||
    data.evaluation ||
    data.checklist ||
    data.guidance ||
    JSON.stringify(data, null, 2)
  );
}

export function facetOptions(
  taxonomy: TaxonomyResponse | null,
  field: string
): { value: string; count?: number }[] {
  if (!taxonomy) return [];
  const staticVals = taxonomy.dimensions[field]?.values ?? [];
  const facetCounts = taxonomy.facets?.[field] ?? {};
  const values = new Set([...staticVals, ...Object.keys(facetCounts)]);
  return [...values]
    .filter(Boolean)
    .sort((a, b) => (facetCounts[b] ?? 0) - (facetCounts[a] ?? 0))
    .map((value) => ({ value, count: facetCounts[value] }));
}
