export type PracticeSubject = "science" | "math";

export type PracticeRequest = {
  subject: PracticeSubject;
  text: string;
  chapterId?: string;
  fromLanding?: boolean;
};

const REQUEST_KEY = "studyRoom:practiceRequest";
const LANDING_USED_KEY = "studyRoom:landingPromptUsed";

export function savePracticeRequest(request: PracticeRequest): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(REQUEST_KEY, JSON.stringify(request));
}

export function loadPracticeRequest(): PracticeRequest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(REQUEST_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PracticeRequest;
  } catch {
    return null;
  }
}

export function clearPracticeRequest(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(REQUEST_KEY);
}

export function markLandingPromptUsed(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LANDING_USED_KEY, "1");
}

export function isLandingPromptUsed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(LANDING_USED_KEY) === "1";
}

export function subjectLabel(subject: PracticeSubject): string {
  return subject === "math" ? "Mathematics" : "Science";
}

export function subjectToApi(subject: PracticeSubject): string {
  return subjectLabel(subject);
}
