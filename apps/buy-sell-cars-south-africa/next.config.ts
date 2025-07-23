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
    minimumCacheTTL: 60, // 1 minute for dynamic updates
    formats: ["image/webp"],
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
          },
        ]
      : [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0",
          },
        ],
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
