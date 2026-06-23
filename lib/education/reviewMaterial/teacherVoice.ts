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

export function resolveVoicePreset(id: string | undefined): TeacherVoicePreset {
  return TEACHER_VOICE_PRESETS.find((p) => p.id === id) ?? TEACHER_VOICE_PRESETS[0];
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
  return scored[0]?.voice ?? null;
}
