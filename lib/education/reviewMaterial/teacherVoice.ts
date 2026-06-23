export type TeacherVoicePresetId =
  | "teacher-female-in"
  | "teacher-male-in"
  | "teacher-female-uk"
  | "teacher-male-uk"
  | "teacher-female-us"
  | "teacher-male-us";

export type TeacherVoicePreset = {
  id: TeacherVoicePresetId;
  label: string;
  lang: string;
  /** BCP-47 hint for speechSynthesis voice matching */
  localeHint: string;
  gender: "female" | "male";
};

export const TEACHER_VOICE_PRESETS: TeacherVoicePreset[] = [
  { id: "teacher-female-in", label: "Female · Indian English", lang: "en-IN", localeHint: "en-in", gender: "female" },
  { id: "teacher-male-in", label: "Male · Indian English", lang: "en-IN", localeHint: "en-in", gender: "male" },
  { id: "teacher-female-uk", label: "Female · UK English", lang: "en-GB", localeHint: "en-gb", gender: "female" },
  { id: "teacher-male-uk", label: "Male · UK English", lang: "en-GB", localeHint: "en-gb", gender: "male" },
  { id: "teacher-female-us", label: "Female · US English", lang: "en-US", localeHint: "en-us", gender: "female" },
  { id: "teacher-male-us", label: "Male · US English", lang: "en-US", localeHint: "en-us", gender: "male" },
];

/** Keep references so Chrome does not garbage-collect utterances mid-playback. */
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function resolveVoicePreset(id: string | undefined): TeacherVoicePreset {
  return TEACHER_VOICE_PRESETS.find((p) => p.id === id) ?? TEACHER_VOICE_PRESETS[0];
}

export function preloadSpeechVoices(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
}

export function pickSpeechVoice(preset: TeacherVoicePreset): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const hint = preset.localeHint.toLowerCase();
  const genderHints =
    preset.gender === "female"
      ? ["female", "woman", "zira", "samantha", "karen", "veena", "heera"]
      : ["male", "man", "david", "mark", "rishi", "daniel"];

  const scored = voices.map((voice) => {
    const name = voice.name.toLowerCase();
    const lang = voice.lang.toLowerCase();
    let score = 0;
    if (lang === preset.lang.toLowerCase()) score += 40;
    else if (lang.startsWith(hint)) score += 30;
    else if (lang.startsWith("en")) score += 10;
    if (genderHints.some((g) => name.includes(g))) score += 25;
    if (name.includes("google")) score += 5;
    return { voice, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  return best && best.score >= 10 ? best.voice : null;
}

export function stopTeacherSpeech(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  activeUtterance = null;
}

function isBenignSpeechError(error: SpeechSynthesisErrorEvent): boolean {
  const code = String(error.error);
  return code === "interrupted" || code === "canceled";
}

export function speakTeacherScript(
  script: string,
  preset: TeacherVoicePreset,
  handlers?: { onStart?: () => void; onEnd?: () => void; onError?: () => void },
): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;

  const trimmed = script.trim();
  if (!trimmed) return false;

  const synth = window.speechSynthesis;
  preloadSpeechVoices();

  if (synth.speaking || synth.pending) {
    synth.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(trimmed);
  activeUtterance = utterance;
  utterance.rate = 0.92;
  utterance.lang = preset.lang;

  const voice = pickSpeechVoice(preset);
  if (voice) utterance.voice = voice;

  utterance.onstart = () => handlers?.onStart?.();
  utterance.onend = () => {
    activeUtterance = null;
    handlers?.onEnd?.();
  };
  utterance.onerror = (event) => {
    activeUtterance = null;
    if (!isBenignSpeechError(event)) handlers?.onError?.();
    else handlers?.onEnd?.();
  };

  // Must run synchronously in the click handler — async delay breaks Chrome user-gesture policy.
  synth.resume();
  synth.speak(utterance);

  return true;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
