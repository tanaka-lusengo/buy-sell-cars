import posthog from "posthog-js";

// Simple check: in dev, only initialize PostHog if feature flag is enabled
const isDev = process.env.NODE_ENV === "development";
const enablePostHogInDev =
  process.env.NEXT_PUBLIC_ENABLE_POSTHOG_DEV === "true";

// Only initialize PostHog if not in dev OR if dev feature flag is enabled
if (!isDev || enablePostHogInDev) {
  isDev && console.log("Initializing PostHog...");
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    capture_pageview: true,
    capture_pageleave: true,
    capture_exceptions: true,
    debug: isDev,
  });
  isDev && console.log("[PostHog] initialized successfully");
} else {
  isDev &&
    console.log("[PostHog] skipped (development mode without feature flag)");
}
