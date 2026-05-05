import type { Metadata } from "next";
import { Sora, Space_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CosmicWatermark } from "@/components/watermark/CosmicWatermark";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brahmando — The Intelligence Repository of Brahmexa",
  description:
    "Brahmando is the sovereign asset repository of the Brahmexa group — AI agents, MCP servers, agentic workflows, and frameworks engineered by ManjuLAB for enterprise customers and community partners.",
  keywords: [
    "R&D repository",
    "MCP servers",
    "AI agents",
    "Brahmexa",
    "ManjuLAB",
    "Brahmando",
    "AI workflows",
    "god of the gaps",
  ],
  authors: [{ name: "ManjuLAB" }],
  openGraph: {
    title: "Brahmando — The Intelligence Repository of Brahmexa",
    description:
      "The sovereign asset repository of the Brahmexa group. AI agents, MCP servers, workflows, and frameworks built by ManjuLAB.",
    url: "https://brahmando.com",
    siteName: "Brahmando",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brahmando — The Intelligence Repository of Brahmexa",
    description:
      "The sovereign asset repository of the Brahmexa group. AI agents, MCP servers, workflows, and frameworks built by ManjuLAB.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${spaceMono.variable} flex min-h-screen flex-col`}>
        <ThemeProvider>
          <CosmicWatermark />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>

        {/* @manjulab watermark — rendered on every page */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-4 right-5 z-[200] select-none"
        >
          <span className="text-[9px] font-bold tracking-[0.28em] text-white/[0.22]">
            @manjulab
          </span>
        </div>
      </body>
    </html>
  );
}
