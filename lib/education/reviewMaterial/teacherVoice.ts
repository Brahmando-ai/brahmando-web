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
let chromeKeepAliveTimer: ReturnType<typeof setInterval> | null = null;
let voicesWarmHandler: (() => void) | null = null;

export type SpeechErrorInfo = {
  code: string;
  message: string;
};

export function resolveVoicePreset(id: string | undefined): TeacherVoicePreset {
  return TEACHER_VOICE_PRESETS.find((p) => p.id === id) ?? TEACHER_VOICE_PRESETS[0];
}

export function preloadSpeechVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

function clearChromeKeepAlive(): void {
  if (chromeKeepAliveTimer) {
    clearInterval(chromeKeepAliveTimer);
    chromeKeepAliveTimer = null;
  }
}

function startChromeKeepAlive(synth: SpeechSynthesis): void {
  clearChromeKeepAlive();
  // Chrome can pause long utterances after ~15s; ping resume while speaking.
  chromeKeepAliveTimer = setInterval(() => {
    if (!synth.speaking) {
      clearChromeKeepAlive();
      return;
    }
    synth.resume();
  }, 12000);
}

export function pickSpeechVoice(preset: TeacherVoicePreset): SpeechSynthesisVoice | null {
  const voices = preloadSpeechVoices();
  if (!voices.length) return null;

  const hint = preset.localeHint.toLowerCase();
  const genderHints =
    preset.gender === "female"
      ? ["female", "woman", "zira", "samantha", "karen", "veena", "heera", "aria"]
      : ["male", "man", "david", "mark", "rishi", "daniel", "guy"];

  const scored = voices.map((voice) => {
    const name = voice.name.toLowerCase();
    const lang = voice.lang.toLowerCase();
    let score = 0;
    if (lang === preset.lang.toLowerCase()) score += 40;
    else if (lang.startsWith(hint)) score += 30;
    else if (lang.startsWith("en")) score += 10;
    if (genderHints.some((g) => name.includes(g))) score += 25;
    if (name.includes("google")) score += 5;
    if (name.includes("microsoft")) score += 4;
    return { voice, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (best && best.score >= 10) return best.voice;

  return (
    voices.find((v) => v.lang.toLowerCase().startsWith("en-us")) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
    voices[0] ??
    null
  );
}

export function stopTeacherSpeech(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  clearChromeKeepAlive();
  if (voicesWarmHandler) {
    window.speechSynthesis.removeEventListener("voiceschanged", voicesWarmHandler);
    voicesWarmHandler = null;
  }
  window.speechSynthesis.cancel();
  activeUtterance = null;
}

function isBenignSpeechError(error: SpeechSynthesisErrorEvent): boolean {
  const code = String(error.error);
  return code === "interrupted" || code === "canceled";
}

function describeSpeechError(event: SpeechSynthesisErrorEvent): SpeechErrorInfo {
  const code = String(event.error);
  const messages: Record<string, string> = {
    "not-allowed": "Browser blocked speech — try clicking Play again.",
    "synthesis-failed": "Speech engine failed — check system volume and default audio output.",
    "synthesis-unavailable": "Speech synthesis is unavailable in this browser.",
    "audio-busy": "Audio device busy — close other apps using the speaker.",
    "network": "Online voice failed — retry or pick a different voice preset.",
    "voice-unavailable": "Selected voice unavailable — try US English preset.",
  };
  return { code, message: messages[code] ?? `Speech error (${code}). Check tab and system volume.` };
}

function buildUtterance(script: string, preset: TeacherVoicePreset): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(script);
  utterance.rate = 0.92;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = pickSpeechVoice(preset);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    // Windows often has no en-IN voice — fall back to a locale that exists.
    utterance.lang = preset.lang.startsWith("en") ? "en-US" : preset.lang;
  }

  return utterance;
}

function attachUtteranceHandlers(
  utterance: SpeechSynthesisUtterance,
  synth: SpeechSynthesis,
  handlers?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (info: SpeechErrorInfo) => void;
  },
): void {
  utterance.onstart = () => {
    startChromeKeepAlive(synth);
    handlers?.onStart?.();
  };
  utterance.onend = () => {
    clearChromeKeepAlive();
    activeUtterance = null;
    handlers?.onEnd?.();
  };
  utterance.onerror = (event) => {
    clearChromeKeepAlive();
    activeUtterance = null;
    if (isBenignSpeechError(event)) {
      handlers?.onEnd?.();
      return;
    }
    handlers?.onError?.(describeSpeechError(event));
  };
}

function speakNow(
  synth: SpeechSynthesis,
  utterance: SpeechSynthesisUtterance,
): void {
  synth.resume();
  synth.speak(utterance);
}

export function speakTeacherScript(
  script: string,
  preset: TeacherVoicePreset,
  handlers?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (info: SpeechErrorInfo) => void;
  },
): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;

  const trimmed = script.trim();
  if (!trimmed) return false;

  const synth = window.speechSynthesis;
  const voices = preloadSpeechVoices();

  const startSpeech = () => {
    if (synth.speaking || synth.pending) {
      synth.cancel();
    }

    const utterance = buildUtterance(trimmed, preset);
    activeUtterance = utterance;
    attachUtteranceHandlers(utterance, synth, handlers);

    // Must stay synchronous with the user click when voices are already loaded.
    speakNow(synth, utterance);

    // Chrome sometimes queues but never starts — nudge once if still idle.
    window.setTimeout(() => {
      if (activeUtterance !== utterance) return;
      if (synth.speaking || synth.pending) return;
      speakNow(synth, utterance);
    }, 120);
  };

  if (voices.length) {
    startSpeech();
    return true;
  }

  // Voices not loaded yet (common on first click) — wait for voiceschanged, then speak.
  if (voicesWarmHandler) {
    synth.removeEventListener("voiceschanged", voicesWarmHandler);
  }
  voicesWarmHandler = () => {
    if (!preloadSpeechVoices().length) return;
    synth.removeEventListener("voiceschanged", voicesWarmHandler!);
    voicesWarmHandler = null;
    startSpeech();
  };
  synth.addEventListener("voiceschanged", voicesWarmHandler);
  preloadSpeechVoices();
  return true;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
