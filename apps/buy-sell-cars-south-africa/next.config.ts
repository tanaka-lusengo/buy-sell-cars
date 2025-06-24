import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const securityHeaders = require("../../securityHeaders.js");

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
  "https://",
  ""
) as string;

const nextConfig: NextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Set a long cache TTL if your images don't change often
    minimumCacheTTL: 2678400, // 31 days
    // Single optimised format to reduce duplicate transformations
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
