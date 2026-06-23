import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Heart, School, Sparkles } from "lucide-react";
import { branding } from "@/lib/branding";

const programs = [
  {
    icon: GraduationCap,
    title: "FAFSA Agent",
    body: "Free U.S. federal student aid coaching — deadlines, dependency status, SAR review, and college cost planning.",
    href: "/education#fafsa",
  },
  {
    icon: BookOpen,
    title: "Abhyas Coach",
    body: "AI exam practice and grading for CBSE/ICSE — aligned with JSI Abhyas A.I Exam Portal for Indian schools.",
    href: "/education/testing",
  },
  {
    icon: Sparkles,
    title: "Scholarship Scout",
    body: "Discover scholarships and grants in the U.S. and India with eligibility coaching and application tips.",
    href: "/education#scholarships",
  },
  {
    icon: School,
    title: "Teacher Copilot",
    body: "Lesson plans optimized for SWAN™ smart classrooms — interactive activities schools can run tomorrow.",
    href: "/education#teacher",
  },
];

export function CSRSection() {
  return (
    <section className="py-24" id="csr">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-100">
              <Heart size={14} />
              Corporate Social Responsibility
            </div>
            <h2 className="section-title">Education Portal — CSR flagship</h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              {branding.developer} invests in <strong className="text-slate-100">Democratizing Intelligence</strong> for
              education. The <strong className="text-cyan-100">Education Portal</strong> is our most important community
              offering — FAFSA coaching, Abhyas exam AI, scholarships, career pathways, and teacher tools for
              under-resourced schools.
            </p>
          </div>
          <Link href="/csr" className="btn-secondary inline-flex shrink-0 items-center gap-2">
            CSR program details
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mb-10 rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-500/10 to-slate-900/60 p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-cyan-100">Education Portal</h3>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-3xl">
            Community access program for schools and nonprofits. The FAFSA Agent lives inside the Education Portal —
            coaching students through federal aid forms, dependency status, SAR review, and college cost planning.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/education/chat" className="btn-primary inline-flex items-center gap-2 text-sm">
              Education Portal
              <ArrowRight size={14} />
            </Link>
            <Link href="/education/explore" className="btn-secondary inline-flex items-center gap-2 text-sm">
              Explore knowledge base
              <ArrowRight size={14} />
            </Link>
            <Link href="/education#fafsa" className="btn-secondary text-sm">
              FAFSA Agent
            </Link>
            <Link href="/access" className="btn-secondary text-sm">
              Community access
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map(({ icon: Icon, title, body, href }) => (
            <Link key={title} href={href} className="card group">
              <div className="mb-4 inline-flex rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-cyan-200">
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-slate-100 group-hover:text-cyan-200 transition-colors">{title}</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">{body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
