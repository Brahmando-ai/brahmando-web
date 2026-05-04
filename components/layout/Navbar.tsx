"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { branding } from "@/lib/branding";

const navLinks = [
  { label: "Agents", href: "/agents" },
  { label: "MCP Servers", href: "/mcp-servers" },
  { label: "Workflows", href: "/workflows" },
  { label: "Docs", href: "/docs" },
  { label: "Access", href: "/access" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-300/15 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 max-w-[100px] items-center justify-center overflow-hidden rounded-xl border border-cyan-300/35 bg-slate-900/60 px-1 shadow-lg shadow-cyan-500/25">
            <Image
              src={branding.logos.brahmando.icon}
              alt="Brahmando logo"
              width={120}
              height={36}
              className="h-7 w-auto max-w-full object-contain"
              priority
            />
          </div>
          <div>
            <span className="block text-lg font-bold tracking-tight text-slate-100 group-hover:text-cyan-200">
              {branding.name}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-400">
              R&D Repository · ManjuLAB
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-cyan-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/#about"
            className="text-xs font-medium text-slate-400 hover:text-orange-200"
          >
            {branding.groupBrand} group
          </Link>
          <span className="text-slate-600">·</span>
          <a
            href={branding.companySite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-slate-300 hover:text-cyan-200"
          >
            Developed by {branding.developer}
          </a>
          <Link href="/access" className="btn-primary px-4 py-2 text-xs">
            Request Access
            <ChevronRight size={14} />
          </Link>
        </div>

        <button
          className="rounded-lg border border-slate-300/20 p-2 text-slate-300 hover:text-cyan-200 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="mx-4 mb-4 rounded-2xl border border-slate-300/20 bg-slate-900/85 p-4 backdrop-blur md:hidden">
          <div className="grid gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/access"
            className="btn-primary mt-4 w-full"
            onClick={() => setOpen(false)}
          >
            Request Access
            <ChevronRight size={14} />
          </Link>
          <p className="mt-3 text-center text-[11px] text-slate-400">
            {branding.groupBrand} group · {branding.developer} · {branding.host}
          </p>
        </div>
      )}
    </header>
  );
}
