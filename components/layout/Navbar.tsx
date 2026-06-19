"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { branding } from "@/lib/branding";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navLinks = [
  { label: "CSR",         href: "/csr" },
  { label: "Education",   href: "/education" },
  { label: "Studio",      href: "/education/studio" },
  { label: "Agents",      href: "/agents" },
  { label: "MCP Servers", href: "/mcp-servers" },
  { label: "Workflows",   href: "/workflows" },
  { label: "Platform",    href: "/platform" },
  { label: "Docs",        href: "/docs" },
  { label: "Access",      href: "/access" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Logo + wordmark */}
        <Link href="/" className="group flex items-center gap-3">
          <div
            className="flex h-8 max-w-[96px] items-center justify-center overflow-hidden rounded-lg px-1"
            style={{
              border: "1px solid var(--border)",
              background: "var(--accent-dim)",
            }}
          >
            <Image
              src={branding.logos.brahmando.icon}
              alt="Brahmando logo"
              width={110}
              height={32}
              className="h-6 w-auto max-w-full object-contain"
              priority
            />
          </div>
          <div>
            <span className="block text-base font-bold tracking-tight text-slate-100 group-hover:text-white">
              {branding.name}
            </span>
            <span className="block text-[9px] uppercase tracking-[0.2em] text-slate-500">
              Asset Repository · Brahmexa
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 lg:gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right controls */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <span className="h-4 w-px bg-slate-700" />
          <a
            href={branding.companySite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            {branding.developer}
          </a>
          <Link href="/access" className="btn-primary px-4 py-2 text-xs">
            Request Access
            <ChevronRight size={13} />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="rounded-lg p-2 text-slate-400 hover:text-slate-200 md:hidden"
          style={{ border: "1px solid var(--border)" }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="mx-4 mb-4 rounded-2xl p-4 backdrop-blur"
          style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
        >
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border)" }}>
            <ThemeToggle />
            <Link
              href="/access"
              className="btn-primary"
              onClick={() => setOpen(false)}
            >
              Request Access
              <ChevronRight size={13} />
            </Link>
          </div>
          <p className="mt-3 text-center text-[10px] text-slate-600">
            {branding.groupBrand} · {branding.developer} · {branding.host}
          </p>
        </div>
      )}
    </header>
  );
}
