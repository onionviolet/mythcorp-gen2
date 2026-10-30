import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;

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
