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
    cta: { label: "Open Abhyas practice UI", href: "/education/abhyas" },
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

        <div className="mb-12 rounded-2xl border border-teal-300/25 bg-teal-400/5 p-6 sm:p-8">
          <h2 className="font-semibold text-teal-100">Abhyas · CBSE Class 10</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
            Full practice and mock-exam UI — official CBSE-X questions, answer-pack JSON, and PDF export with student
            diagrams and uploads.
          </p>
          <Link href="/education/abhyas" className="btn-primary mt-5 inline-flex items-center gap-2 text-sm">
            Open Abhyas practice
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mb-12 rounded-2xl border border-cyan-300/30 bg-cyan-400/5 p-6 sm:p-8">
          <h2 className="font-semibold text-cyan-100">Try the Education Portal</h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-3xl">
            Open the full chat UI for role-based questions — students, teachers, schools, and coaching centers. Ask about
            CBSE exams, FAFSA, lesson plans, mock tests, and syllabus planning. Or use the{" "}
            <strong className="text-cyan-300/90">🎓 button</strong> (bottom-left) on any Education page.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/education/chat" className="btn-primary inline-flex items-center gap-2 text-sm">
              Open Education Portal chat
              <ArrowRight size={14} />
            </Link>
            <Link href="/education/explore" className="btn-secondary inline-flex items-center gap-2 text-sm">
              Explore knowledge base
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="mb-12 rounded-2xl border border-violet-300/25 bg-violet-400/5 p-6 sm:p-8">
          <h2 className="font-semibold text-violet-100">Category filters + NLP search</h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-3xl">
            Filter by syllabus (CBSE, ICSE), competitive tracks
            (Medical, Engineering, Civil Services, Banking…), exam body, and core academic subjects —
            then search in plain English across past papers and guides.
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
              {"cta" in m && m.cta && (
                <Link href={m.cta.href} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-200 hover:underline">
                  {m.cta.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
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
