/** Education Portal API — proxied via chat.brahmando.com (works from brahmando.com). */

export const EDUCATION_API =
  process.env.NEXT_PUBLIC_EDUCATION_API_URL ||
  "https://chat.brahmando.com/api/education";

export type EducationActor = "student" | "teacher" | "school" | "coaching_center";

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

export async function postActorChat(
  actor: EducationActor,
  message: string,
  context: Record<string, unknown> = {}
): Promise<ActorChatResponse> {
  const res = await fetch(`${EDUCATION_API.replace(/\/$/, "")}/actors/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actor, message, context }),
  });
  const data = (await res.json()) as ActorChatResponse;
  if (!res.ok) {
    throw new Error(data.detail || `HTTP ${res.status}`);
  }
  return data;
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
