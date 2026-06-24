"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, BellOff, Check, Copy, Link2, Moon, UserPlus, Users, X } from "lucide-react";
import {
  INITIAL_PEERS,
  PEER_FOLLOW_UP,
  SCHEDULED_INVITES,
  pickRandom,
  statusLabel,
  type IncomingInvite,
  type QuickReply,
  type StudyPeer,
} from "@/lib/study-room/mockPresence";

export type { StudyPeer } from "@/lib/study-room/mockPresence";

type UserPresence = "online" | "dnd";

type Props = {
  roomId?: string;
  onPeerMessage?: (peer: StudyPeer, text: string) => void;
  onStudentMessage?: (text: string) => void;
  onIncomingInvite?: (invite: IncomingInvite | null) => void;
  onDndChange?: (dnd: boolean) => void;
};

export function StudyTogetherPanel({
  roomId = "sr-mock-a7f2",
  onPeerMessage,
  onStudentMessage,
  onIncomingInvite,
  onDndChange,
}: Props) {
  const [peers, setPeers] = useState<StudyPeer[]>(INITIAL_PEERS);
  const [userPresence, setUserPresence] = useState<UserPresence>("online");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [pendingInvite, setPendingInvite] = useState<string | null>(null);
  const [activeInvite, setActiveInvite] = useState<IncomingInvite | null>(null);
  const [mutedWhileDnd, setMutedWhileDnd] = useState(0);
  const inviteIndex = useRef(0);
  const respondedPeers = useRef<Set<string>>(new Set());
  const userPresenceRef = useRef(userPresence);
  const peersRef = useRef(peers);

  useEffect(() => {
    userPresenceRef.current = userPresence;
  }, [userPresence]);

  useEffect(() => {
    peersRef.current = peers;
  }, [peers]);

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/study-room/join/${roomId}`
      : `https://brahmando.com/study-room/join/${roomId}`;

  const onlineCount = peers.filter((p) => !p.isYou && p.status === "online").length;
  const dndCount = peers.filter((p) => !p.isYou && p.status === "dnd").length;

  const pushInvite = useCallback(
    (invite: IncomingInvite | null) => {
      setActiveInvite(invite);
      onIncomingInvite?.(invite);
    },
    [onIncomingInvite]
  );

  const fireInvite = useCallback(
    (slot: number) => {
      if (slot >= SCHEDULED_INVITES.length) return;
      const template = SCHEDULED_INVITES[slot]!;
      if (respondedPeers.current.has(template.peerId)) return;
      const peer = peersRef.current.find((p) => p.id === template.peerId);
      if (!peer || peer.status === "dnd" || peer.status === "invited") return;

      const invite: IncomingInvite = {
        ...template,
        id: `inv-${template.peerId}-${Date.now()}`,
        sentAt: Date.now(),
      };
      inviteIndex.current = slot + 1;

      if (userPresenceRef.current === "dnd") {
        setMutedWhileDnd((n) => n + 1);
        return;
      }
      pushInvite(invite);
      setPeers((prev) =>
        prev.map((p) => (p.id === template.peerId ? { ...p, status: "invited" as const } : p))
      );
    },
    [pushInvite]
  );

  useEffect(() => {
    const timers = [
      setTimeout(() => fireInvite(0), 11000),
      setTimeout(() => fireInvite(1), 38000),
      setTimeout(() => fireInvite(2), 72000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [fireInvite]);

  useEffect(() => {
    onDndChange?.(userPresence === "dnd");
  }, [userPresence, onDndChange]);

  const toggleDnd = () => {
    const goingDnd = userPresence !== "dnd";
    setUserPresence(goingDnd ? "dnd" : "online");
    setPeers((prev) =>
      prev.map((p) =>
        p.isYou
          ? {
              ...p,
              status: goingDnd ? ("dnd" as const) : ("online" as const),
              dndReason: goingDnd ? "Do not disturb" : undefined,
            }
          : p
      )
    );
    if (!goingDnd && mutedWhileDnd > 0) {
      setTimeout(() => fireInvite(inviteIndex.current), 1200);
    }
  };

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [inviteLink]);

  const sendInvite = () => {
    const email = inviteEmail.trim();
    if (!email) return;
    setPendingInvite(email);
    setInviteEmail("");
    setTimeout(() => {
      setPeers((prev) => [
        ...prev,
        {
          id: `inv-${Date.now()}`,
          name: email.split("@")[0] ?? "Classmate",
          initials: (email[0] ?? "?").toUpperCase(),
          status: "invited",
        },
      ]);
      setPendingInvite(null);
      setInviteOpen(false);
    }, 800);
  };

  const respondToInvite = useCallback(
    (action: "join" | "decline" | "ignore", reply?: QuickReply) => {
      if (!activeInvite) return;
      respondedPeers.current.add(activeInvite.peerId);

      if (action === "join" && reply) {
        onStudentMessage?.(reply.message);
        setPeers((prev) =>
          prev.map((p) =>
            p.id === activeInvite.peerId
              ? { ...p, status: "online" as const, chapter: activeInvite.chapter, subject: activeInvite.subject }
              : p
          )
        );
        setTimeout(() => {
          onPeerMessage?.(
            {
              id: activeInvite.peerId,
              name: activeInvite.peerName,
              initials: activeInvite.peerInitials,
              status: "online",
              chapter: activeInvite.chapter,
              subject: activeInvite.subject,
            },
            pickRandom(PEER_FOLLOW_UP[activeInvite.peerId]?.join ?? ["See you in the room!"])
          );
        }, 1400);
      } else if (action === "decline" && reply) {
        onStudentMessage?.(reply.message);
        setPeers((prev) =>
          prev.map((p) => (p.id === activeInvite.peerId ? { ...p, status: "idle" as const } : p))
        );
        setTimeout(() => {
          const followUp = pickRandom(PEER_FOLLOW_UP[activeInvite.peerId]?.decline ?? ["No problem!"]);
          if (followUp) {
            onPeerMessage?.(
              {
                id: activeInvite.peerId,
                name: activeInvite.peerName,
                initials: activeInvite.peerInitials,
                status: "idle",
              },
              followUp
            );
          }
        }, 1800);
      } else {
        setPeers((prev) =>
          prev.map((p) => (p.id === activeInvite.peerId ? { ...p, status: "idle" as const } : p))
        );
        const followUp = pickRandom(PEER_FOLLOW_UP[activeInvite.peerId]?.ignore ?? [""]);
        if (followUp) {
          setTimeout(() => {
            onPeerMessage?.(
              {
                id: activeInvite.peerId,
                name: activeInvite.peerName,
                initials: activeInvite.peerInitials,
                status: "idle",
              },
              followUp
            );
          }, 4000);
        }
      }
      pushInvite(null);
    },
    [activeInvite, onPeerMessage, onStudentMessage, pushInvite]
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ action: "join" | "decline" | "ignore"; reply?: QuickReply }>).detail;
      respondToInvite(detail.action, detail.reply);
    };
    window.addEventListener("study-invite-respond", handler);
    return () => window.removeEventListener("study-invite-respond", handler);
  }, [respondToInvite]);

  return (
    <div className="rounded-2xl border border-violet-300/25 bg-violet-500/5 p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
            <Users className="h-3.5 w-3.5" />
            Study together
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            {onlineCount} online · {dndCount} DND
          </p>
        </div>
        <button
          type="button"
          onClick={toggleDnd}
          className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all ${
            userPresence === "dnd"
              ? "border-red-400/40 bg-red-500/15 text-red-200"
              : "border-slate-600/40 bg-slate-800/50 text-slate-400 hover:border-slate-500/50"
          }`}
          title={userPresence === "dnd" ? "Turn off Do Not Disturb" : "Do Not Disturb"}
        >
          {userPresence === "dnd" ? <BellOff className="h-3 w-3" /> : <Bell className="h-3 w-3" />}
          {userPresence === "dnd" ? "DND on" : "DND"}
        </button>
      </div>

      {userPresence === "dnd" && (
        <p className="mb-3 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-[10px] leading-relaxed text-red-200/90">
          <Moon className="mr-1 inline h-3 w-3" />
          You won&apos;t see invites while DND is on.
          {mutedWhileDnd > 0 && ` (${mutedWhileDnd} muted)`}
        </p>
      )}

      {activeInvite && userPresence !== "dnd" && (
        <div className="mb-3 lg:hidden">
          <p className="mb-1 text-[10px] font-medium text-violet-300">Incoming invite</p>
          <p className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-2.5 py-2 text-xs text-slate-200">
            {activeInvite.peerName}: {activeInvite.message.slice(0, 60)}…
          </p>
        </div>
      )}

      <ul className="mb-3 max-h-[220px] space-y-2 overflow-y-auto pr-0.5">
        {peers.map((peer) => (
          <li
            key={peer.id}
            className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 ${
              peer.status === "dnd"
                ? "border-red-500/20 bg-red-950/20"
                : "border-slate-700/40 bg-slate-900/50"
            }`}
          >
            <div
              className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                peer.isYou
                  ? userPresence === "dnd"
                    ? "bg-red-500/20 text-red-200 ring-1 ring-red-400/40"
                    : "bg-cyan-500/25 text-cyan-200 ring-1 ring-cyan-400/40"
                  : peer.status === "dnd"
                    ? "bg-red-900/40 text-red-300/80"
                    : peer.status === "invited"
                      ? "bg-amber-500/15 text-amber-200"
                      : peer.status === "idle"
                        ? "bg-slate-700/60 text-slate-400"
                        : "bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/30"
              }`}
            >
              {peer.initials}
              {peer.status === "dnd" && (
                <Moon className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-red-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-slate-200">
                {peer.name}
                {peer.isYou && <span className="text-slate-500"> (you)</span>}
              </p>
              {peer.chapter ? (
                <p className="truncate text-[10px] text-slate-500">{peer.chapter}</p>
              ) : null}
              <p className="text-[10px] text-slate-600">{statusLabel(peer.status, peer.dndReason)}</p>
            </div>
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                peer.status === "online"
                  ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
                  : peer.status === "idle"
                    ? "bg-amber-500/80"
                    : peer.status === "invited"
                      ? "animate-pulse bg-violet-400"
                      : peer.status === "dnd"
                        ? "bg-red-500/90"
                        : "bg-slate-600"
              }`}
              title={statusLabel(peer.status, peer.dndReason)}
            />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setInviteOpen(true)}
        disabled={userPresence === "dnd"}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/35 bg-violet-500/15 px-3 py-2.5 text-sm font-medium text-violet-100 transition-all hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <UserPlus className="h-4 w-4" />
        Invite classmate
      </button>

      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-violet-300/25 bg-slate-900 p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-100">Invite to shared study room</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Classmates join the same virtual room — shared presence and group chat.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mb-1 block text-xs font-medium text-slate-400">Share link</label>
            <div className="mb-4 flex gap-2">
              <input
                readOnly
                value={inviteLink}
                className="flex-1 rounded-xl border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-xs text-slate-300"
              />
              <button type="button" onClick={copyLink} className="btn-secondary shrink-0 px-3 py-2 text-xs">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <label className="mb-1 block text-xs font-medium text-slate-400">Or invite by email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="classmate@school.edu"
                className="flex-1 rounded-xl border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
                onKeyDown={(e) => e.key === "Enter" && sendInvite()}
              />
              <button
                type="button"
                onClick={sendInvite}
                disabled={!!pendingInvite}
                className="btn-primary shrink-0 px-4 py-2 text-xs disabled:opacity-50"
              >
                {pendingInvite ? "Sending…" : "Send"}
              </button>
            </div>

            <p className="mt-4 flex items-start gap-2 text-[10px] leading-relaxed text-slate-500">
              <Link2 className="mt-0.5 h-3 w-3 shrink-0" />
              Requires cbse10-core subscription. Web-only group study.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/** Dispatch invite response from the main study-room card (parent coordinates UI). */
export function dispatchInviteResponse(
  action: "join" | "decline" | "ignore",
  reply?: QuickReply
) {
  window.dispatchEvent(new CustomEvent("study-invite-respond", { detail: { action, reply } }));
}
