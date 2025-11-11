import posthog from "posthog-js";

// Simple check: in dev, only initialize PostHog if feature flag is enabled
const isDev = process.env.NODE_ENV === "development";
const enablePostHogInDev =
  process.env.NEXT_PUBLIC_ENABLE_POSTHOG_DEV === "true";

// Only initialize PostHog if not in dev OR if dev feature flag is enabled
if (!isDev || enablePostHogInDev) {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!posthogKey) {
    console.error("[PostHog] API key not found");
  } else {
    try {
      isDev && console.log("Initializing PostHog...");
      posthog.init(posthogKey, {
        api_host: "/ph-analytics-bsc",
        ui_host: "https://eu.posthog.com",
        capture_pageview: true,
        capture_pageleave: true,
        capture_exceptions: true,
        debug: isDev,
        // Gracefully handle blocked requests (ad blockers, etc.)
        loaded: (posthog) => {
          isDev && console.log("[PostHog] loaded successfully");
        },
        // Suppress network errors to prevent console spam
        on_request_error: (error) => {
          if (isDev) {
            console.warn(
              "[PostHog] Request blocked (likely by ad blocker):",
              error
            );
          }
          // Silently fail in production to avoid console spam
        },
      });
      isDev && console.log("[PostHog] initialized successfully");
    } catch (error) {
      if (isDev) {
        console.error("[PostHog] initialization failed:", error);
      }
      // Silently fail in production
    }
  }
} else {
  isDev &&
    console.log("[PostHog] skipped (development mode without feature flag)");
}
