import { GraduationCap, Heart, Server, Workflow } from "lucide-react";

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
    title: "SMB workflows",
    description:
      "Rhythm for agent-first automation and Nandi for lean support ticketing — product workflows on the same GPU stack, not a public demo catalog.",
  },
  {
    icon: Server,
    title: "Hosted platform",
    description:
      "GPU-backed API gateway, live agents, and observability for ManjuLAB customers — see Platform for current service health.",
  },
];

export function WhatIsBrahmando() {
  return (
    <section className="py-24" id="what-is-brahmando">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="section-title">What Brahmando is today</h2>
          <p className="section-subtitle mx-auto text-center">
            A focused public site for community programs and platform access — not a sprawling
            agent catalog. Enterprise assets deploy behind customer agreements.
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
