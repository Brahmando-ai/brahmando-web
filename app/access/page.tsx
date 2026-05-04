import Link from "next/link";
import { branding } from "@/lib/branding";

export default function AccessPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
          {branding.groupBrand} group
        </p>
        <h1 className="section-title mt-2">Access the Brahmando repository</h1>
        <p className="section-subtitle mt-3">
          Brahmando hosts ManjuLAB-developed agents, MCP servers, and workflows. It is not a public
          self-serve marketplace: deployment and detailed documentation are available through
          ManjuLAB customer agreements or the community access program.
        </p>

        <section id="customer" className="mt-14 scroll-mt-24 rounded-2xl border border-cyan-300/25 bg-slate-900/50 p-8">
          <h2 className="text-xl font-semibold text-slate-100">ManjuLAB Customer Access</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Enterprise customers work with ManjuLAB under commercial terms. Your team receives
            access to the Brahmando catalog, integration support, and the operational stack aligned
            to your security and compliance requirements.
          </p>
          <a
            href={branding.companySite}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 inline-flex"
          >
            Contact ManjuLAB
          </a>
          <p className="mt-3 text-xs text-slate-500">
            Use the contact or inquiry form on the ManjuLAB site, or reach your account executive
            directly.
          </p>
        </section>

        <section id="community" className="mt-10 scroll-mt-24 rounded-2xl border border-orange-300/25 bg-slate-900/50 p-8">
          <h2 className="text-xl font-semibold text-slate-100">Community Access Program</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            ManjuLAB offers selected Brahmando assets at no cost to under-resourced organisations and
            community partners. Eligibility and scope are reviewed case by case; this is not an open
            download of the full repository.
          </p>
          <a
            href={branding.companySite}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary mt-6 inline-flex"
          >
            Apply via ManjuLAB
          </a>
          <p className="mt-3 text-xs text-slate-500">
            Describe your organisation and mission on the ManjuLAB contact form; the team will reply
            with eligibility and next steps.
          </p>
        </section>

        <p className="mt-10 text-center text-sm text-slate-400">
          <Link href="/" className="text-cyan-200 hover:text-cyan-100">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
