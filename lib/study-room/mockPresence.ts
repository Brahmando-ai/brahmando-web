/** Simulated study-room presence, invites, and quick-reply templates. */

import { MOCK_STUDENT } from "@/lib/study-room/mockProgressData";

export type PresenceStatus = "online" | "idle" | "invited" | "dnd";

export type StudyPeer = {
  id: string;
  name: string;
  initials: string;
  status: PresenceStatus;
  chapter?: string;
  subject?: string;
  isYou?: boolean;
  dndReason?: string;
  lastSeen?: string;
};

export type StudyPeerFull = StudyPeer;

export type IncomingInvite = {
  id: string;
  peerId: string;
  peerName: string;
  peerInitials: string;
  message: string;
  chapter: string;
  subject: string;
  sentAt: number;
};

export type QuickReply = {
  id: string;
  label: string;
  message: string;
};

export const JOIN_REPLIES: QuickReply[] = [
  { id: "j1", label: "Join now", message: "Sure, joining now! Give me a sec to grab my notes." },
  { id: "j2", label: "2 min", message: "On my way — finishing one MCQ, be there in 2 minutes." },
  { id: "j3", label: "Let's go", message: "Yes! Let's compare how we solved the diagram questions." },
];

export const DECLINE_REPLIES: QuickReply[] = [
  { id: "d1", label: "Busy now", message: "Busy with a chapter quiz right now — maybe after?" },
  { id: "d2", label: "Later today", message: "Can't hop in now. Free around 6 PM if you're still on Light?" },
  { id: "d3", label: "Mock prep", message: "Heads down for mock prep today — catch you tomorrow!" },
];

export const INITIAL_PEERS: StudyPeerFull[] = [
  {
    id: "you",
    name: MOCK_STUDENT.name,
    initials: "PK",
    status: "online",
    chapter: "Light – Reflection and Refraction",
    subject: "Science",
    isYou: true,
  },
  {
    id: "arjun",
    name: "Arjun M.",
    initials: "AM",
    status: "online",
    chapter: "Light – Reflection and Refraction",
    subject: "Science",
    lastSeen: "now",
  },
  {
    id: "riya",
    name: "Riya P.",
    initials: "RP",
    status: "idle",
    chapter: "Polynomials",
    subject: "Mathematics",
    lastSeen: "3m ago",
  },
  {
    id: "meera",
    name: "Meera S.",
    initials: "MS",
    status: "online",
    chapter: "Polynomials",
    subject: "Mathematics",
    lastSeen: "now",
  },
  {
    id: "vikram",
    name: "Vikram K.",
    initials: "VK",
    status: "dnd",
    chapter: "Board mock — Science",
    subject: "Science",
    dndReason: "In a timed mock",
    lastSeen: "now",
  },
  {
    id: "ananya",
    name: "Ananya D.",
    initials: "AD",
    status: "dnd",
    chapter: "Chemical reactions",
    subject: "Science",
    dndReason: "Do not disturb",
    lastSeen: "12m ago",
  },
];

/** Scripted invites that may appear while you study (skipped when you are on DND). */
export const SCHEDULED_INVITES: Omit<IncomingInvite, "id" | "sentAt">[] = [
  {
    peerId: "riya",
    peerName: "Riya P.",
    peerInitials: "RP",
    message: "I'm on Polynomials — want to hop in and do a quick 5-question drill together?",
    chapter: "Polynomials",
    subject: "Mathematics",
  },
  {
    peerId: "meera",
    peerName: "Meera S.",
    peerInitials: "MS",
    message: "Study room's quiet today. Join me for Light revision before the board mock?",
    chapter: "Light – Reflection and Refraction",
    subject: "Science",
  },
  {
    peerId: "arjun",
    peerName: "Arjun M.",
    peerInitials: "AM",
    message: "Anyone up for comparing ray diagrams? I keep mixing up concave rules.",
    chapter: "Light – Reflection and Refraction",
    subject: "Science",
  },
];

export const PEER_FOLLOW_UP: Record<string, { join: string[]; decline: string[]; ignore: string[] }> = {
  riya: {
    join: ["Nice — I'll share my cheat sheet for factor theorem.", "Cool, I'll wait in the room."],
    decline: ["No stress! Ping me when you're free.", "Okay — good luck with the quiz!"],
    ignore: ["Guess they're heads-down… I'll try later.", ""],
  },
  meera: {
    join: ["Great, see you in the room!", "Perfect timing — I have two MCQs to discuss."],
    decline: ["All good — maybe after dinner?", "Sure, focus on your chapter first."],
    ignore: ["", "Hmm, maybe they're in a mock…"],
  },
  arjun: {
    join: ["Awesome — I'll paste my diagram notes.", "Joining! This chapter is tricky."],
    decline: ["No worries — I'll figure it out from NCERT.", "Catch you later then!"],
    ignore: ["", ""],
  },
};

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function statusLabel(status: PresenceStatus, dndReason?: string): string {
  if (status === "dnd") return dndReason || "Do not disturb";
  if (status === "idle") return "Away";
  if (status === "invited") return "Invite pending";
  return "Online";
}
