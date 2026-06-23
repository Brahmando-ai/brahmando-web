"use client";

import type { ReviewNote, ReviewNoteStatus } from "@/lib/education/reviewMaterial/types";

const STORAGE_KEY = "brahmando_cbse10_review_notes_v1";
const REVIEWER_KEY = "brahmando_cbse10_reviewer_name";

function readAll(): ReviewNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ReviewNote[];
  } catch {
    return [];
  }
}

function writeAll(notes: ReviewNote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function getReviewerName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(REVIEWER_KEY) ?? "";
}

export function setReviewerName(name: string) {
  localStorage.setItem(REVIEWER_KEY, name.trim());
}

export function listNotes(chapterId?: string): ReviewNote[] {
  const notes = readAll();
  if (!chapterId) return notes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return notes
    .filter((n) => n.chapterId === chapterId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function addNote(input: Omit<ReviewNote, "id" | "createdAt" | "updatedAt" | "status"> & { status?: ReviewNoteStatus }): ReviewNote {
  const now = new Date().toISOString();
  const note: ReviewNote = {
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: input.status ?? "open",
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  writeAll([note, ...readAll()]);
  return note;
}

export function updateNoteStatus(id: string, status: ReviewNoteStatus) {
  const notes = readAll().map((n) =>
    n.id === id ? { ...n, status, updatedAt: new Date().toISOString() } : n
  );
  writeAll(notes);
}

export function exportNotesJson(): string {
  return JSON.stringify(readAll(), null, 2);
}

export function importNotesJson(json: string) {
  const incoming = JSON.parse(json) as ReviewNote[];
  const existing = readAll();
  const merged = [...incoming, ...existing.filter((e) => !incoming.some((i) => i.id === e.id))];
  writeAll(merged);
}
