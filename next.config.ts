import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    // Public editorial content: fast client navigation, periodic background
    // refresh, and a hard expiry as a safety net for missed invalidations.
    editorial: {
      stale: 300,
      revalidate: 900,
      expire: 86_400,
    },
  },
};

export default nextConfig;
