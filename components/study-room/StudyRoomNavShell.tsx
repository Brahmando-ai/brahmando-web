import { Suspense } from "react";
import { StudyRoomNav } from "@/components/study-room/StudyRoomNav";

export function StudyRoomNavShell() {
  return (
    <Suspense fallback={<div className="mb-6 h-10 animate-pulse rounded-full bg-slate-800/60" />}>
      <StudyRoomNav />
    </Suspense>
  );
}
