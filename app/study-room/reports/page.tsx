import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GuardianReportMock } from "@/components/study-room/GuardianReportMock";

export const metadata = {
  title: "Progress Report · Study Room | Brahmando",
  description: "Weekly guardian and teacher progress report for CBSE 10 students.",
};

export default function StudyRoomReportsPage() {
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
      <GuardianReportMock />
    </div>
  );
}
