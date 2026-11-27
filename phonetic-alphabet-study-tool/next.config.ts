import type { NextConfig } from "next";

// GitHub Pages serves a project site from a sub-path such as
// /phonentic-alphabet-study-tool. The deploy workflow sets PAGES_BASE_PATH;
// locally it is empty, so the site runs from /.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Build a static site into out/, which is what GitHub Pages hosts.
  output: "export",
  basePath,
  // Next.js adds basePath to its own links and assets, but not to URLs the
  // app builds itself (the speech engine in lib/speech.ts), so expose it.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  experimental: {
    agentFeedback: true,
  },
  // cacheComponents and partialPrefetching were removed: they need a Next.js
  // server, and a static export fails with "PPR cannot be enabled in export mode".
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
