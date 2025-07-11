import posthog from "posthog-js";

// Simple check: in dev, only initialize PostHog if feature flag is enabled
const isDev = process.env.NODE_ENV === "development";
const enablePostHogInDev =
  process.env.NEXT_PUBLIC_ENABLE_POSTHOG_DEV === "true";

// Only initialize PostHog if not in dev OR if dev feature flag is enabled
if (!isDev || enablePostHogInDev) {
  console.log("Initializing PostHog...");
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    capture_pageview: false, // This disables automatic pageview tracking, set to true if you want this
    capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
    debug: isDev,
  });
  console.log("[PostHog] initialized successfully");
} else {
  console.log("[PostHog] skipped (development mode without feature flag)");
}
