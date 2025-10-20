import { describe, it, expect, beforeEach, vi } from "vitest";
import { pageview, event, GA_TRACKING_ID } from "./gtag";

// Mock window.gtag
const mockGtag = vi.fn();

describe("Google Analytics gtag helpers", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock window object with gtag and location
    Object.defineProperty(window, "gtag", {
      value: mockGtag,
      writable: true,
      configurable: true,
    });

    // Mock window.location.origin
    Object.defineProperty(window, "location", {
      value: {
        origin: "https://example.com",
      },
      writable: true,
      configurable: true,
    });
  });

  describe("GA_TRACKING_ID", () => {
    it("should export the tracking ID from environment variable", () => {
      expect(GA_TRACKING_ID).toBe(process.env.NEXT_PUBLIC_GA_ID);
    });
  });

  describe("pageview", () => {
    it("should call gtag with correct config parameters", () => {
      const testUrl = "/test-page";

      pageview(testUrl);

      expect(mockGtag).toHaveBeenCalledTimes(2);
      expect(mockGtag).toHaveBeenNthCalledWith(1, "config", GA_TRACKING_ID, {
        page_location: "https://example.com/test-page",
      });
      expect(mockGtag).toHaveBeenNthCalledWith(
        2,
        "config",
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        {
          page_location: "https://example.com/test-page",
        }
      );
    });

    it("should handle URLs with query parameters", () => {
      const testUrl = "/test-page?param=value&another=test";

      pageview(testUrl);

      expect(mockGtag).toHaveBeenCalledWith("config", GA_TRACKING_ID, {
        page_location: "https://example.com/test-page?param=value&another=test",
      });
    });

    it("should not call gtag when window.gtag is undefined", () => {
      // Temporarily set gtag to undefined
      const originalGtag = window.gtag;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag = undefined;

      pageview("/test-page");

      expect(mockGtag).not.toHaveBeenCalled();

      // Restore gtag
      window.gtag = originalGtag;
    });

    it("should handle empty URL", () => {
      const testUrl = "";

      pageview(testUrl);

      expect(mockGtag).toHaveBeenCalledWith("config", GA_TRACKING_ID, {
        page_location: "https://example.com",
      });
    });
  });

  describe("event", () => {
    it("should call gtag with all event parameters", () => {
      const eventData = {
        action: "click",
        category: "engagement",
        label: "hero-button",
        value: 1,
      };

      event(eventData);

      expect(mockGtag).toHaveBeenCalledTimes(1);
      expect(mockGtag).toHaveBeenCalledWith("event", "click", {
        event_category: "engagement",
        event_label: "hero-button",
        value: 1,
      });
    });

    it("should call gtag with required parameters only", () => {
      const eventData = {
        action: "submit",
        category: "form",
      };

      event(eventData);

      expect(mockGtag).toHaveBeenCalledWith("event", "submit", {
        event_category: "form",
        event_label: undefined,
        value: undefined,
      });
    });

    it("should handle optional label parameter", () => {
      const eventData = {
        action: "download",
        category: "engagement",
        label: "pdf-brochure",
      };

      event(eventData);

      expect(mockGtag).toHaveBeenCalledWith("event", "download", {
        event_category: "engagement",
        event_label: "pdf-brochure",
        value: undefined,
      });
    });

    it("should handle optional value parameter", () => {
      const eventData = {
        action: "purchase",
        category: "ecommerce",
        value: 99.99,
      };

      event(eventData);

      expect(mockGtag).toHaveBeenCalledWith("event", "purchase", {
        event_category: "ecommerce",
        event_label: undefined,
        value: 99.99,
      });
    });

    it("should not call gtag when window.gtag is undefined", () => {
      // Temporarily set gtag to undefined
      const originalGtag = window.gtag;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag = undefined;

      event({
        action: "click",
        category: "test",
      });

      expect(mockGtag).not.toHaveBeenCalled();

      // Restore gtag
      window.gtag = originalGtag;
    });

    it("should handle zero value", () => {
      const eventData = {
        action: "rating",
        category: "feedback",
        value: 0,
      };

      event(eventData);

      expect(mockGtag).toHaveBeenCalledWith("event", "rating", {
        event_category: "feedback",
        event_label: undefined,
        value: 0,
      });
    });

    it("should handle special characters in action and category", () => {
      const eventData = {
        action: "click-button_with-special@chars",
        category: "ui/ux-testing",
        label: "test-label with spaces",
      };

      event(eventData);

      expect(mockGtag).toHaveBeenCalledWith(
        "event",
        "click-button_with-special@chars",
        {
          event_category: "ui/ux-testing",
          event_label: "test-label with spaces",
          value: undefined,
        }
      );
    });
  });

  describe("server-side rendering safety", () => {
    it("should not throw error when window is undefined (SSR)", () => {
      // Mock SSR environment
      const originalWindow = global.window;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (global as any).window;

      expect(() => {
        pageview("/test-page");
      }).not.toThrow();

      expect(() => {
        event({
          action: "test",
          category: "test",
        });
      }).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });
  });

  describe("edge cases", () => {
    it("should handle very long URLs", () => {
      const longUrl = "/very-long-page-url-" + "a".repeat(1000);

      pageview(longUrl);

      expect(mockGtag).toHaveBeenCalledWith("config", GA_TRACKING_ID, {
        page_location: "https://example.com" + longUrl,
      });
    });

    it("should handle very long event labels", () => {
      const longLabel = "very-long-label-" + "b".repeat(500);

      event({
        action: "test",
        category: "test",
        label: longLabel,
      });

      expect(mockGtag).toHaveBeenCalledWith("event", "test", {
        event_category: "test",
        event_label: longLabel,
        value: undefined,
      });
    });

    it("should handle negative values", () => {
      event({
        action: "test",
        category: "test",
        value: -5,
      });

      expect(mockGtag).toHaveBeenCalledWith("event", "test", {
        event_category: "test",
        event_label: undefined,
        value: -5,
      });
    });
  });
});
