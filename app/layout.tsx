import type { Metadata } from "next";
import { Sora, Space_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
  title: "Brahmando — R&D Repository of ManjuLAB · Brahmexa group",
  description:
    "Curated AI agents, MCP servers, and workflows developed by ManjuLAB R&D and hosted on Brahmando — offered to ManjuLAB customers and community partners under the Brahmexa group brand.",
  keywords: [
    "R&D repository",
    "MCP servers",
    "AI agents",
    "Brahmexa",
    "ManjuLAB",
    "Brahmando",
    "AI workflows",
  ],
  authors: [{ name: "ManjuLAB" }],
  openGraph: {
    title: "Brahmando — R&D Repository of ManjuLAB · Brahmexa group",
    description:
      "ManjuLAB R&D assets hosted on Brahmando. Access via ManjuLAB customer agreements or the community program.",
    url: "https://brahmando.com",
    siteName: "Brahmando",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brahmando — R&D Repository of ManjuLAB · Brahmexa group",
    description:
      "ManjuLAB R&D assets hosted on Brahmando. Access via ManjuLAB customer agreements or the community program.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${spaceMono.variable} flex min-h-screen flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
