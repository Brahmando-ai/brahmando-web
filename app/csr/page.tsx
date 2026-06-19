import Link from "next/link";
import { ArrowRight, BookOpen, Heart, Search, Server } from "lucide-react";
import { PartnerLogosBar } from "@/components/branding/PartnerLogosBar";
import { branding } from "@/lib/branding";

export default function CSRPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-100">
            <Heart size={14} />
            CSR · Community programs
          </div>
          <h1 className="section-title">Corporate Social Responsibility</h1>
          <p className="section-subtitle max-w-3xl">
            {branding.host} hosts ManjuLAB-developed assets. Through CSR, we deliver AI education tools at no cost to
            qualifying schools, students, and community partners — starting with the Education Portal and FAFSA Agent.
          </p>
          <PartnerLogosBar className="mt-8" showTopRule={false} />
        </div>

        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          <Link
            href="/education"
            className="group rounded-2xl border border-cyan-300/30 bg-cyan-400/5 p-6 sm:p-8 transition-colors hover:border-cyan-300/50 hover:bg-cyan-400/10"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-cyan-200">
                <Server size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-cyan-100 group-hover:text-cyan-50">Education Portal</h2>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Flagship CSR offering — FAFSA coaching, Abhyas exam AI, scholarships, career pathways, and teacher
                  tools. Use the 🎓 chat widget on Education pages for role-based help.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 group-hover:text-cyan-100">
                  Open Education Portal
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/education/explore"
            className="group rounded-2xl border border-violet-300/30 bg-violet-400/5 p-6 sm:p-8 transition-colors hover:border-violet-300/50 hover:bg-violet-400/10"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl border border-violet-300/20 bg-violet-400/10 p-3 text-violet-200">
                <Search size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-violet-100 group-hover:text-violet-50">Explore knowledge base</h2>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Filter by syllabus (CBSE, ICSE), competitive tracks, exam body, and subject — then search in plain
                  English across past papers and study guides.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-200 group-hover:text-violet-100">
                  Browse & search
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-slate-100">Who we serve</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300 leading-relaxed">
              <li>Under-resourced U.S. high schools — FAFSA completion support</li>
              <li>Indian schools using JSI SWAN boards and Abhyas exam portal</li>
              <li>Community colleges and nonprofit education partners</li>
              <li>First-generation college applicants and rural learners</li>
            </ul>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold text-slate-100">How to participate</h2>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Schools and nonprofits apply through the community access program. Approved partners receive access to
              the Education Portal — including FAFSA coaching, Abhyas exam AI, scholarships, and teacher tools — plus
              optional chat widget integration.
            </p>
            <Link href="/access" className="btn-primary mt-6 inline-flex items-center gap-2 text-sm">
              Request community access
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-300/30 bg-cyan-400/5 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-cyan-200">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-cyan-100">FAFSA Agent</h2>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-3xl">
                Dedicated knowledge base for U.S. federal student aid. The <strong className="text-slate-100">FAFSA Agent</strong>{" "}
                coaches students through federal aid forms, dependency status, SAR review, and college cost planning.
              </p>
              <Link href="/education#fafsa" className="mt-4 inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100">
                FAFSA Agent details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
