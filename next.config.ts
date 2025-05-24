import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const securityHeaders = require("./securityHeaders.js");

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
