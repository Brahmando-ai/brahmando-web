/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: "output: export" was removed to enable API routes (server-side health checks).
  // Deploy to a Node-capable host (e.g. Vercel) instead of GitHub Pages static export.

  basePath: "",

  // Disable built-in Next.js image optimisation.
  // Use standard <img> tags or a CDN instead.
  images: {
    unoptimized: true,
  },

  trailingSlash: true,
};

module.exports = nextConfig;
