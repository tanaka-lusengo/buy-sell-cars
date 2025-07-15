import { describe, it, expect } from "vitest";
import { SOUTH_AFRICA_CONFIG, ZIMBABWE_CONFIG } from "./country-configs";

describe("Country Configurations", () => {
  describe("South Africa Config", () => {
    it("has correct name", () => {
      expect(SOUTH_AFRICA_CONFIG.name).toBe("South Africa");
    });

    it("has correct locations", () => {
      expect(SOUTH_AFRICA_CONFIG.locations).toContain("Gauteng");
      expect(SOUTH_AFRICA_CONFIG.locations).toContain("Western Cape");
      expect(SOUTH_AFRICA_CONFIG.locations.length).toBeGreaterThan(0);
    });

    it("has correct PostHog setting", () => {
      expect(SOUTH_AFRICA_CONFIG.enablePosthog).toBe(false);
    });

    it("has valid supabase project ID", () => {
      expect(SOUTH_AFRICA_CONFIG.supabaseProjectId).toBeTruthy();
      expect(typeof SOUTH_AFRICA_CONFIG.supabaseProjectId).toBe("string");
    });
  });

  describe("Zimbabwe Config", () => {
    it("has correct name", () => {
      expect(ZIMBABWE_CONFIG.name).toBe("Zimbabwe");
    });

    it("has correct locations", () => {
      expect(ZIMBABWE_CONFIG.locations).toContain("Harare");
      expect(ZIMBABWE_CONFIG.locations).toContain("Bulawayo");
      expect(ZIMBABWE_CONFIG.locations.length).toBeGreaterThan(0);
    });

    it("has correct PostHog setting", () => {
      expect(ZIMBABWE_CONFIG.enablePosthog).toBe(true);
    });

    it("has dealer logos", () => {
      expect(ZIMBABWE_CONFIG.dealerLogos.length).toBeGreaterThan(0);
      expect(ZIMBABWE_CONFIG.dealerLogos).toContain("Welly Motors");
    });

    it("has valid supabase project ID", () => {
      expect(ZIMBABWE_CONFIG.supabaseProjectId).toBeTruthy();
      expect(typeof ZIMBABWE_CONFIG.supabaseProjectId).toBe("string");
    });
  });
});
