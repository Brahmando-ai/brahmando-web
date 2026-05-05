import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">

        <h1 className="section-title">Documents</h1>
        <p className="section-subtitle">
          Structured knowledge that powers the Brahmando universe.
        </p>

        <div className="prose prose-invert mt-16 max-w-none prose-a:text-cyan-200 prose-p:leading-relaxed prose-p:text-slate-300">

          <h2>What are Documents?</h2>

          <p>
            Documents in Brahmando are not just files — they are knowledge artifacts: structured
            intelligence units that define how agents reason, how workflows execute, and how MCP
            servers respond.
          </p>

          <p>
            Think of them as the reference layer of the universe — the ground truth that everything
            else builds on. Where general AI knowledge ends, a Document begins.
          </p>

          <div className="section-rule my-10" />

          <h2>How Documents connect to the catalog</h2>

          <p>
            <strong>Agents</strong> consume documents as context — policy references, domain
            knowledge, operating procedures, evaluation rubrics. Without documents, an agent
            operates on general knowledge. With them, it operates on <em>your</em> knowledge.
          </p>

          <p>
            <strong>Workflows</strong> treat documents as inputs and outputs — contracts to review,
            reports to generate, briefs to process. The document is both the trigger and the
            artifact. A workflow without documents is a pipeline without purpose.
          </p>

          <p>
            <strong>MCP servers</strong> expose document interfaces so that external systems can
            push or pull structured content in real time — bridging your data environment with the
            agent layer.
          </p>

          <div className="section-rule my-10" />

          <h2>Getting started</h2>

          <p>
            If you are new to Brahmando, start with the{" "}
            <Link href="/agents">Agents catalog</Link>. Documents become relevant once you are
            running agents or designing workflows.
          </p>

          <p>
            They are the knowledge layer, not the entry point. When you need an agent to understand
            your business context, operate within your policies, or produce consistent structured
            output — that is when documents matter.
          </p>

          <div className="section-rule my-10" />

          <h2>Access</h2>

          <p>
            Document schemas, templates, and integration guides are provided to ManjuLAB customers
            and approved community partners as part of the access program.
          </p>

          <p>
            If you are ready to bring your own knowledge into the system, the access program is
            where that journey begins.
          </p>

          <p className="mt-8">
            <Link href="/access" className="font-semibold">
              Request access →
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
