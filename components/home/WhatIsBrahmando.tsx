import { GraduationCap, Heart, Megaphone, Server, Workflow } from "lucide-react";
import { platformStats } from "@/lib/platform-catalog";
import { RHYTHM_SMB_VERTICALS_SUMMARY } from "@/lib/rhythm-verticals";

const pillars = [
  {
    icon: Heart,
    title: "CSR & community",
    description:
      "Free AI education tools for qualifying schools and nonprofits — Education Portal, FAFSA coaching, and knowledge-base search.",
  },
  {
    icon: GraduationCap,
    title: "Education Portal",
    description:
      "Flagship CSR program with role-based chat, syllabus filters, and ingested CBSE/competitive content — accessed through the CSR hub.",
  },
  {
    icon: Workflow,
    title: "Rhythm · 4 SMB verticals",
    description: RHYTHM_SMB_VERTICALS_SUMMARY,
  },
  {
    icon: Megaphone,
    title: "Reach marketing",
    description:
      "Agentic marketing orchestrator for local SMBs — website + owner briefs in, FB/Instagram/LinkedIn/email/YouTube and local group outreach out, with WhatsApp approval.",
  },
  {
    icon: Server,
    title: "Hosted platform",
    description:
      `GPU-backed stack with ${platformStats.agents} live agents and ${platformStats.mcpServers} MCP servers — see Platform for visitor entry points.`,
  },
];

export function WhatIsBrahmando() {
  return (
    <section className="py-24" id="what-is-brahmando">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="section-title">What Brahmando is today</h2>
          <p className="section-subtitle mx-auto text-center">
            A focused public site for community programs and platform access. The GPU stack currently runs{" "}
            <strong className="text-slate-200">{platformStats.agents} agents</strong>,{" "}
            <strong className="text-slate-200">{platformStats.mcpServers} MCP servers</strong>, and{" "}
            <strong className="text-slate-200">{platformStats.workflows} SMB workflows</strong> (Rhythm, Nandi, Reach marketing).
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="card flex flex-col gap-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ border: "1px solid var(--border)", background: "var(--accent-dim)" }}
              >
                <p.icon size={19} style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="text-base font-semibold text-slate-100">{p.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
