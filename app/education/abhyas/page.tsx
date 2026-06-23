import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AbhyasTestingEmbed } from "@/components/education/AbhyasTestingEmbed";
import { ABHYAS_API_PRACTICE, abhyasTestingEmbedUrl } from "@/lib/education/abhyasUrls";

export const metadata = {
  title: "Abhyas · CBSE Class 10 Practice | Brahmando",
  description:
    "Official CBSE Class 10 Science and Mathematics practice, mock exams, and answer-pack export — powered by Abhyas.",
};

export default function AbhyasTestingPage() {
  return (
    <div className="pb-16 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Link
          href="/education"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Education Portal
        </Link>

        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Abhyas by Anyo</p>
        <h1 className="section-title mt-2">CBSE Class 10 Practice & Mock Exam</h1>
        <p className="section-subtitle mt-3 max-w-3xl">
          Quick quizzes and timed board-style papers from the official CBSE-X question bank. Submit creates an answer
          pack with JSON and PDF download (including student diagrams). Phase-1: no auto-grading — built for teacher
          review.
        </p>

        <ul className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
          <li className="rounded-full border border-emerald-300/20 bg-emerald-400/5 px-3 py-1">Science & Mathematics</li>
          <li className="rounded-full border border-cyan-300/20 bg-cyan-400/5 px-3 py-1">1–40 questions per session</li>
          <li className="rounded-full border border-cyan-300/20 bg-cyan-400/5 px-3 py-1">PDF + JSON answer pack</li>
        </ul>

        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-300/15 bg-slate-900/30 shadow-2xl shadow-cyan-500/5">
          <AbhyasTestingEmbed />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Alternate API client:{" "}
          <a href={ABHYAS_API_PRACTICE} className="text-cyan-300/80 hover:underline" target="_blank" rel="noopener noreferrer">
            {ABHYAS_API_PRACTICE}
          </a>
          {" · "}
          <a href={abhyasTestingEmbedUrl()} className="text-cyan-300/80 hover:underline" target="_blank" rel="noopener noreferrer">
            Open embed URL
          </a>
        </p>
      </div>
    </div>
  );
}
