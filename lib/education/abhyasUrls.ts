/** Abhyas CBSE-X practice client URLs for brahmando.com embeds. */

const EDUCATION_API = "https://api.brahmando.com/education";

/** First-party static client on brahmando.com (same-origin iframe — reliable). */
export const ABHYAS_TESTING_BASE = "https://brahmando.com/abhyas-testing/";

/** Yogabrata mirror (partner / legacy). */
export const ABHYAS_YOGABRATA_BASE = "https://yogabrata.com/testing/";

/** API-hosted clients. */
export const ABHYAS_API_PRACTICE = `${EDUCATION_API}/abhyas/client/practice-test.html`;

export const ABHYAS_DEMO_TOKEN = "abhyas-test-token-sangati-2026";

export function abhyasTestingEmbedUrl(params?: {
  subject?: string;
  count?: number;
  mode?: "practice" | "mock_exam";
  scope?: "official" | "anyo";
}) {
  const q = new URLSearchParams({
    embed: "1",
    token: ABHYAS_DEMO_TOKEN,
    api: `${EDUCATION_API}/abhyas`,
  });
  if (params?.subject) q.set("subject", params.subject);
  if (params?.count) q.set("count", String(params.count));
  if (params?.mode) q.set("mode", params.mode);
  if (params?.scope) q.set("scope", params.scope);
  return `${ABHYAS_TESTING_BASE}?${q.toString()}`;
}
