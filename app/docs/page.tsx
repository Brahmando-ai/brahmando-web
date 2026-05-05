import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="section-title">Documents</h1>
        <p className="section-subtitle">
          Structured knowledge that powers the Brahmando universe.
        </p>

        <div className="prose prose-invert mt-12 max-w-none prose-a:text-cyan-200">
          <h2>What are Documents?</h2>
          <p>
            Documents in Brahmando are not just files — they are knowledge artifacts: structured
            intelligence units that define how agents reason, how workflows execute, and how MCP
            servers respond. Think of them as the reference layer of the universe — the ground
            truth that everything else builds on.
          </p>

          <h2>How Documents connect to the catalog</h2>
          <p>
            <strong>Agents</strong> consume documents as context — policy references, domain
            knowledge, operating procedures, evaluation rubrics. Without documents, an agent
            operates on general knowledge. With them, it operates on <em>your</em> knowledge.
          </p>
          <p>
            <strong>Workflows</strong> treat documents as inputs and outputs — contracts to review,
            reports to generate, briefs to process. The document is both the trigger and the
            artifact.
          </p>
          <p>
            <strong>MCP servers</strong> expose document interfaces so that external systems can
            push or pull structured content in real time — bridging your data environment with the
            agent layer.
          </p>

          <h2>Getting started</h2>
          <p>
            If you are new to Brahmando, start with the{" "}
            <Link href="/agents">Agents catalog</Link>. Documents become relevant once you are
            running agents or designing workflows — they are the knowledge layer, not the entry
            point. When you need an agent to understand your business context, operate within your
            policies, or produce consistent structured output, that is when documents matter.
          </p>

          <h2>Access</h2>
          <p>
            Document schemas, templates, and integration guides are provided to ManjuLAB customers
            and approved community partners as part of the access program.
          </p>
          <p>
            <Link href="/access" className="font-semibold">
              Request access →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
