import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EducationAdminClient } from "@/components/education/EducationAdminClient";

export const metadata = {
  title: "Education Admin · Brahmando",
  description: "SKU manifest studio and knowledge review queue for the education platform.",
  robots: { index: false, follow: false },
};

export default function EducationAdminPage() {
  return (
    <div className="mesh-bg relative z-10 min-h-screen">
      <div className="border-b border-slate-300/10 bg-slate-950/50 px-4 py-3 sm:px-6">
        <Link
          href="/education"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Education Portal
        </Link>
      </div>
      <EducationAdminClient />
    </div>
  );
}
