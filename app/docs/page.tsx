import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="section-title">Documentation</h1>
        <p className="section-subtitle">
          High-level orientation for the Brahmando site and repository. Step-by-step build, deploy, and
          integration guides are provided to ManjuLAB customers and community partners under access
          agreements — not published here as open self-serve instructions.
        </p>

        <div className="prose prose-invert mt-12 max-w-none prose-a:text-cyan-200">
          <h2>Architecture overview</h2>
          <p>
            Brahmando spans three layers: the <strong>frontend</strong> (Next.js, static export for the
            public catalog), the <strong>agent layer</strong> (FastAPI MCP servers and the agent registry),
            and the <strong>workflow layer</strong> (n8n JSON exports and YAML agentic pipelines). ManjuLAB
            develops and curates the assets; Brahmando hosts the catalog under the Brahmexa group brand.
          </p>

          <h2>Access model</h2>
          <p>
            The repository is the system of record for ManjuLAB R&D outputs offered to customers (paid) and
            to under-resourced communities (through ManjuLAB programs). It is not positioned as a public
            anonymous marketplace. For customer onboarding or community eligibility, use the access page.
          </p>
          <p>
            <Link href="/access" className="font-semibold">
              Request access →
            </Link>
          </p>

          <h2>Brand &amp; design system</h2>
          <p>
            Brand tokens live in <code>/packages/ui/branding.ts</code>. Logo paths point under{" "}
            <code>/public/branding/</code>; update those files when assets change.
          </p>
        </div>
      </div>
    </div>
  );
}
