import Image from "next/image";
import Link from "next/link";
import { branding } from "@/lib/branding";

const footerLinks = {
  Programs: [
    { label: "CSR",                href: "/csr" },
    { label: "Education Portal",   href: "/education" },
    { label: "Live agents (2)",    href: "/agents" },
    { label: "MCP servers (2)",    href: "/mcp-servers" },
    { label: "Platform",           href: "/platform" },
    { label: "Docs",               href: "/docs" },
  ],
  Company: [
    { label: "ManjuLAB",          href: "https://manjulab.com", external: true },
    { label: "Brahmexa group",     href: "/#about" },
    { label: "Customer Access",    href: "/access#customer" },
    { label: "Community Program",  href: "/access#community" },
  ],
};

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "rgba(0,0,0,0.35)" }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div
                className="flex h-7 max-w-[84px] items-center justify-center overflow-hidden rounded-lg px-0.5"
                style={{ border: "1px solid var(--border)", background: "var(--accent-dim)" }}
              >
                <Image
                  src={branding.logos.brahmando.icon}
                  alt="Brahmando logo"
                  width={96}
                  height={28}
                  className="h-5 w-auto max-w-full object-contain"
                />
              </div>
              <span className="font-bold text-slate-200">{branding.name}</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              {branding.tagline}
            </p>
            <p className="mt-3 text-xs text-slate-600">
              A {branding.groupBrand} group platform · Built by{" "}
              <a
                href={branding.companySite}
                className="hover:text-slate-300"
                style={{ color: "var(--accent)" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {branding.developer}
              </a>
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                {group}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-500 transition-colors hover:text-slate-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-500 transition-colors hover:text-slate-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-10 flex items-center justify-between pt-6 text-xs text-slate-700"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p>© {new Date().getFullYear()} ManjuLAB. All rights reserved.</p>
          <p className="hidden sm:block">
            {branding.groupBrand} · {branding.host}
          </p>
        </div>
      </div>
    </footer>
  );
}
