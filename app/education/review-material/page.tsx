import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReviewMaterialBoard } from "@/components/education/ReviewMaterialBoard";

export const metadata = {
  title: "Review Material · CBSE 10 | Brahmando",
  description:
    "Educator review board for CBSE Class 10 chapter content — visuals, audio narration, observations, and triage.",
};

export default function ReviewMaterialPage() {
  return (
    <div className="mesh-bg min-h-screen">
      <div className="border-b border-slate-300/10 bg-slate-950/50 px-4 py-3 sm:px-6">
        <Link
          href="/education"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Education Portal
        </Link>
      </div>
      <ReviewMaterialBoard />
    </div>
  );
}
