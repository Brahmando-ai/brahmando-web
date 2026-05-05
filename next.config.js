/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages
  output: "export",

  // Required when deploying to GitHub Pages under a repo subpath.
  // Set to "" when using a custom domain (brahmando.com).
  basePath: "",

  // Disable built-in Next.js image optimisation (not supported in static export).
  // Use standard <img> tags or a CDN instead.
  images: {
    unoptimized: true,
  },

  // Trailing slashes ensure GitHub Pages serves index.html correctly.
  trailingSlash: true,
};

module.exports = nextConfig;
