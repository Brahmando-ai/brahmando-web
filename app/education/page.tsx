import Link from "next/link";
import { ArrowRight } from "lucide-react";

const modules = [
  {
    id: "fafsa",
    name: "FAFSA Agent",
    summary: "U.S. federal student aid coaching — deadlines, dependency, SAR, Pell Grant basics.",
    endpoints: ["POST /fafsa/ask", "POST /fafsa/checklist", "POST /fafsa/dependency", "POST /fafsa/scholarship-plan", "POST /student-aid/plan"],
    sample: "What documents do I need before starting FAFSA?",
  },
  {
    id: "abhyas",
    name: "Abhyas Coach",
    summary: "AI exam practice and grading for Indian schools (CBSE/ICSE).",
    endpoints: ["POST /exams/generate", "POST /exams/grade"],
    sample: "Generate 5 medium MCQs on photosynthesis for Class 10 CBSE",
  },
  {
    id: "scholarships",
    name: "Scholarship Scout",
    summary: "Scholarship discovery for U.S. and India with eligibility notes.",
    endpoints: ["POST /scholarships/match", "POST /scholarships/coach"],
    sample: "Scholarships for a 12th grader interested in computer science in India",
  },
  {
    id: "career",
    name: "Career Pathway Planner",
    summary: "Near/mid/long-term education and skills roadmap.",
    endpoints: ["POST /career/pathway"],
    sample: "Career pathway for a 16-year-old interested in AI and robotics",
  },
  {
    id: "teacher",
    name: "Teacher Copilot",
    summary: "Lesson plans for SWAN™ smart classrooms.",
    endpoints: ["POST /teacher/plan"],
    sample: "45-minute Grade 8 science lesson on ecosystems with smart board activities",
  },
];

export default function EducationPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">CSR · Community program</p>
          <h1 className="section-title">Education Portal</h1>
          <p className="section-subtitle max-w-3xl">
            Brahmando&apos;s flagship CSR education offering. Unified access with auto-routing chat and five modules —
            including the FAFSA Agent for U.S. federal student aid coaching.
          </p>
        </div>

        <div className="mb-12 rounded-2xl border border-cyan-300/30 bg-cyan-400/5 p-6 sm:p-8">
          <h2 className="font-semibold text-cyan-100">Education Studio — try it live</h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-3xl">
            Act as <strong className="text-slate-100">Student</strong>, <strong className="text-slate-100">Teacher</strong>,{" "}
            <strong className="text-slate-100">School</strong>, or <strong className="text-slate-100">Coaching center</strong> —
            run workflows for syllabus planning, question papers, grading, mock tests, and CBSE trend analysis.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/education/studio" className="btn-primary inline-flex items-center gap-2 text-sm">
              Open Education Studio
              <ArrowRight size={14} />
            </Link>
            <Link href="/education/explore" className="btn-secondary inline-flex items-center gap-2 text-sm">
              Browse knowledge base
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="mb-12 rounded-2xl border border-violet-300/25 bg-violet-400/5 p-6 sm:p-8">
          <h2 className="font-semibold text-violet-100">Category filters + NLP search</h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-3xl">
            Filter by syllabus (CBSE, ICSE), grades 1–12, board exams (Class 10 & 12), competitive tracks
            (Medical, Engineering, Civil Services, Banking…), and subject — then search in plain English across
            past papers and guides in the knowledge base.
          </p>
          <Link href="/education/explore" className="btn-secondary mt-5 inline-flex items-center gap-2 text-sm">
            Open Knowledge Explorer
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mb-12 rounded-2xl border border-emerald-300/25 bg-emerald-400/5 p-6">
          <h2 className="font-semibold text-emerald-100">Unified entrypoint</h2>
          <p className="mt-2 text-sm text-slate-300">
            <code className="text-emerald-200">POST /chat</code> auto-detects module from the message. Approved community
            partners access the Education Portal through the{" "}
            <Link href="/access" className="text-cyan-200 hover:underline">community access program</Link>.
          </p>
        </div>

        <div className="grid gap-6">
          {modules.map((m) => (
            <article key={m.id} id={m.id} className="card scroll-mt-24">
              <h2 className="text-lg font-semibold text-slate-100">{m.name}</h2>
              <p className="mt-2 text-sm text-slate-300">{m.summary}</p>
              <p className="mt-3 text-xs font-mono text-cyan-200/90">{m.endpoints.join(" · ")}</p>
              <p className="mt-3 text-sm text-slate-400">
                <span className="text-slate-500">Example: </span>&ldquo;{m.sample}&rdquo;
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/csr" className="btn-secondary inline-flex items-center gap-2">
            CSR program
            <ArrowRight size={14} />
          </Link>
          <Link href="/access" className="btn-primary inline-flex items-center gap-2">
            Request access
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
