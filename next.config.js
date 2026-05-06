/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  basePath: "",

  // Disable built-in Next.js image optimisation.
  // Use standard <img> tags or a CDN instead.
  images: {
    unoptimized: true,
  },

  trailingSlash: true,
};

module.exports = nextConfig;
