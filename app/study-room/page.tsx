import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { StudyRoomMock } from "@/components/study-room/StudyRoomMock";
import { StudyRoomNavShell } from "@/components/study-room/StudyRoomNavShell";

export const metadata = {
  title: "Study Room | Brahmando",
  description: "Virtual study room for CBSE 10, SAT, and ACT — chapter learning, quizzes, and section mocks.",
};

export default function StudyRoomPage() {
  return (
    <div className="mesh-bg min-h-screen pb-16">
      <div className="border-b border-slate-300/10 bg-slate-950/50 px-4 py-3 sm:px-6">
        <Link
          href="/education"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Education Portal
        </Link>
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <StudyRoomNavShell />
      </div>
      <Suspense fallback={<div className="py-16 text-center text-slate-400">Loading study room…</div>}>
        <StudyRoomMock />
      </Suspense>
    </div>
  );
}
