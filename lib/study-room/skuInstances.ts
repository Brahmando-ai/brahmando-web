import type { SkuInstance, StudySkuId } from "@/lib/study-room/types";

const EDUCATION_API = "https://api.brahmando.com/education";

export const SKU_INSTANCES: Record<StudySkuId, SkuInstance> = {
  "cbse10-core": {
    id: "cbse10-core",
    displayName: "CBSE 10 Core",
    tagline: "Science & Mathematics — NCERT-aligned chapter study, quizzes, and board mocks.",
    subscribeLabel: "Subscribe · CBSE 10 SaaS",
    boardMockLabel: "Board mock",
    peerLocale: "in",
    curriculumPath: `${EDUCATION_API}/cbse10/curriculum`,
    usesLiveQuiz: false,
  },
  "sat-act": {
    id: "sat-act",
    displayName: "SAT / ACT Preparation",
    tagline: "Official College Board & ACT prep — skill drills and section mocks.",
    subscribeLabel: "Subscribe · SAT/ACT",
    boardMockLabel: "Section mock",
    peerLocale: "us",
    curriculumPath: `${EDUCATION_API}/sat-act/curriculum`,
    questionsPath: `${EDUCATION_API}/sat-act/questions/sample`,
    usesLiveQuiz: true,
  },
};

export const DEFAULT_SKU: StudySkuId = "cbse10-core";

export function normalizeSkuId(raw: string | null | undefined): StudySkuId {
  if (raw === "sat-act") return "sat-act";
  return "cbse10-core";
}

export function getSkuInstance(skuId: StudySkuId): SkuInstance {
  return SKU_INSTANCES[skuId];
}

export function studyRoomHref(skuId: StudySkuId, path = "/study-room"): string {
  const base = path === "/study-room" ? "/study-room" : path;
  if (skuId === DEFAULT_SKU) return base;
  return `${base}?sku=${skuId}`;
}
