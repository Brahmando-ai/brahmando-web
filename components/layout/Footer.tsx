import Image from "next/image";
import Link from "next/link";
import { branding } from "@/lib/branding";

const footerLinks = {
  Repository: [
    { label: "Agents", href: "/agents" },
    { label: "MCP Servers", href: "/mcp-servers" },
    { label: "Workflows", href: "/workflows" },
    { label: "Docs", href: "/docs" },
  ],
  Company: [
    { label: "ManjuLAB", href: "https://manjulab.com", external: true },
    { label: "Brahmexa", href: "/#about" },
    { label: "Customer Access", href: "/access#customer" },
    { label: "Community Program", href: "/access#community" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-300/15 bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 max-w-[88px] items-center justify-center overflow-hidden rounded-lg border border-cyan-300/35 bg-slate-900/60 px-0.5">
                <Image
                  src={branding.logos.brahmando.icon}
                  alt="Brahmando logo"
                  width={100}
                  height={28}
                  className="h-6 w-auto max-w-full object-contain"
                />
              </div>
              <span className="font-bold text-slate-100">{branding.name}</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-300">
              {branding.tagline}
            </p>
            <p className="mt-3 text-xs text-slate-400">
              A {branding.groupBrand} group brand · Developed by{" "}
              <a
                href={branding.companySite}
                className="text-cyan-200 hover:text-cyan-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                {branding.developer}
              </a>
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                {group}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-300 hover:text-cyan-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-300 hover:text-cyan-200"
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

        <div className="mt-10 border-t border-slate-300/15 pt-6 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ManjuLAB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
