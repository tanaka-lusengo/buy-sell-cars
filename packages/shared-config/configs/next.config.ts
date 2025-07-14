import type { NextConfig } from "next";

interface CreateNextConfigOptions {
    supabaseUrl?: string;
    enablePosthog?: boolean;
}

export function createNextConfig(
    options: CreateNextConfigOptions = {},
): NextConfig {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const securityHeaders = require("../../../securityHeaders.js");

    const supabaseHostname = options.supabaseUrl?.replace(
        "https://",
        "",
    ) as string;

    const baseConfig: NextConfig = {
        trailingSlash: true,
        reactStrictMode: true,
        eslint: {
            ignoreDuringBuilds: true,
        },
        typescript: {
            ignoreBuildErrors: true,
        },
        images: {
            minimumCacheTTL: 2678400, // 31 days
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
                    headers: securityHeaders,
                },
            ];
        },
        skipTrailingSlashRedirect: true,
    };

    // Add PostHog rewrites if enabled
    if (options.enablePosthog) {
        baseConfig.rewrites = async () => [
            {
                source: "/ingest/static/:path*",
                destination: "https://eu-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/ingest/:path*",
                destination: "https://eu.i.posthog.com/:path*",
            },
            {
                source: "/ingest/decide",
                destination: "https://eu.i.posthog.com/decide",
            },
        ];
    }

    return baseConfig;
}
