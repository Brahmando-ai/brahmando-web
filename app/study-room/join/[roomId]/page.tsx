import Link from "next/link";
import { Users } from "lucide-react";
import { StudyRoomNavShell } from "@/components/study-room/StudyRoomNavShell";

export const metadata = {
  title: "Join Study Room | Brahmando",
  description: "Join a shared CBSE 10 study room with classmates (SaaS web).",
};

type Props = {
  params: Promise<{ roomId: string }>;
};

export function generateStaticParams() {
  return [{ roomId: "sr-mock-a7f2" }];
}

/** Mock join landing — production will validate invite token + SKU scope */
export default async function StudyRoomJoinPage({ params }: Props) {
  const { roomId } = await params;
  return (
    <div className="mesh-bg min-h-screen pb-16">
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <StudyRoomNavShell />
        <div className="rounded-3xl border border-violet-300/25 bg-slate-900/70 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20">
            <Users className="h-7 w-7 text-violet-300" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50">Join shared study room</h1>
          <p className="mt-2 text-sm text-slate-400">
            Room <code className="text-violet-300">{roomId}</code> · CBSE 10 Core
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Priya invited you to study together in the same virtual room. Sign in with your Brahmando student
            account to join.
          </p>
          <Link href="/study-room" className="btn-primary mt-8 inline-flex">
            Enter study room (mock)
          </Link>
          <p className="mt-4 text-xs text-slate-500">SaaS web only · invite link mock</p>
        </div>
      </div>
    </div>
  );
}
