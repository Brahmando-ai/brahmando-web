"use client";

import { BellOff, Check, MessageCircle, UserPlus, X } from "lucide-react";
import {
  DECLINE_REPLIES,
  JOIN_REPLIES,
  type IncomingInvite,
  type QuickReply,
} from "@/lib/study-room/mockPresence";

type Props = {
  invite: IncomingInvite;
  onJoin: (reply: QuickReply) => void;
  onDecline: (reply: QuickReply) => void;
  onIgnore: () => void;
  compact?: boolean;
};

export function StudyRoomInviteCard({ invite, onJoin, onDecline, onIgnore, compact }: Props) {
  return (
    <div
      className={`rounded-2xl border border-violet-300/35 bg-gradient-to-br from-violet-500/15 to-slate-900/80 p-4 shadow-lg shadow-violet-900/20`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/25 text-sm font-bold text-violet-100 ring-2 ring-violet-400/40">
          {invite.peerInitials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-300/90">
            Study together invite
          </p>
          <p className="mt-0.5 font-medium text-slate-100">{invite.peerName}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">&ldquo;{invite.message}&rdquo;</p>
          <p className="mt-1 text-[10px] text-slate-500">
            {invite.subject} · {invite.chapter}
          </p>
        </div>
        <button
          type="button"
          onClick={onIgnore}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
          title="Ignore"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400/90">
            <UserPlus className="h-3 w-3" /> Join
          </p>
          <div className="flex flex-wrap gap-1.5">
            {JOIN_REPLIES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onJoin(r)}
                className="rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3 py-1.5 text-left text-xs text-emerald-100 transition hover:bg-emerald-400/20"
                title={r.message}
              >
                <Check className="mr-1 inline h-3 w-3" />
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400/90">
            <MessageCircle className="h-3 w-3" /> Decline politely
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DECLINE_REPLIES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onDecline(r)}
                className="rounded-full border border-amber-400/30 bg-amber-400/5 px-3 py-1.5 text-left text-xs text-amber-100/90 transition hover:bg-amber-400/15"
                title={r.message}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onIgnore}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-600/40 py-2 text-xs text-slate-500 transition hover:border-slate-500/50 hover:text-slate-400"
        >
          <BellOff className="h-3.5 w-3.5" />
          Ignore for now
        </button>
      </div>
    </div>
  );
}
