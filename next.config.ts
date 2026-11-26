import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default async function config() {
  if (process.env.NODE_ENV === "development" && process.env.POPMELT_DEV_SESSION) {
    const { withPopmelt } = await import("@popmelt.com/core/next");
    return withPopmelt(nextConfig);
  }
  return nextConfig;
}

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`.
// Gated to dev because that is the only place it does anything: `next build`
// loads this config in more than one process, each one starting its own
// miniflare runtime against the same .wrangler/state SQLite, and the second
// one dies on SQLITE_BUSY. Nothing renders at build time that needs bindings;
// every route that touches them is force-dynamic.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}
