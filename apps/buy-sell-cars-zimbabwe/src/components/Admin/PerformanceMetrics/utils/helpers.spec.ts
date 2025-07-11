import { describe, it, expect, vi, beforeEach } from "vitest";
import { PostHogSponsorAdClickData } from "../types";
import {
  transformSponsorClicks,
  transformByPlacement,
  createPlacementColors,
  calculateChartHeight,
  generateAxisTicks,
  getMaxValue,
} from "./helpers";

// Mock the constants module
vi.mock("../constants", () => ({
  themeColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"],
  BAR_HEIGHT: 40,
  MIN_HEIGHT: 200,
  MAX_HEIGHT: 600,
}));

describe("PerformanceMetrics Helper Functions", () => {
  describe("transformSponsorClicks", () => {
    it("should transform sponsor click data correctly", () => {
      const mockData: PostHogSponsorAdClickData[] = [
        ["click", "banner", "Company A"],
        ["click", "sidebar", "Company B"],
        ["click", "footer", "Company A"],
        ["click", "header", "Company C"],
        ["click", "banner", "Company A"],
      ];

      const result = transformSponsorClicks(mockData);

      expect(result).toEqual([
        { company: "Company A", clicks: 3 },
        { company: "Company B", clicks: 1 },
        { company: "Company C", clicks: 1 },
      ]);
    });

    it("should handle empty array", () => {
      const result = transformSponsorClicks([]);
      expect(result).toEqual([]);
    });

    it("should filter out entries with no sponsor", () => {
      const mockData: PostHogSponsorAdClickData[] = [
        ["click", "banner", "Company A"],
        ["click", "sidebar", ""],
        ["click", "footer", "Company A"],
      ];

      const result = transformSponsorClicks(mockData);

      expect(result).toEqual([{ company: "Company A", clicks: 2 }]);
    });

    it("should sort results by clicks in descending order", () => {
      const mockData: PostHogSponsorAdClickData[] = [
        ["click", "banner", "Company A"],
        ["click", "sidebar", "Company B"],
        ["click", "footer", "Company B"],
        ["click", "header", "Company B"],
        ["click", "banner", "Company C"],
        ["click", "sidebar", "Company C"],
      ];

      const result = transformSponsorClicks(mockData);

      expect(result).toEqual([
        { company: "Company B", clicks: 3 },
        { company: "Company C", clicks: 2 },
        { company: "Company A", clicks: 1 },
      ]);
    });
  });

  describe("transformByPlacement", () => {
    // Mock console.log to avoid test output noise
    beforeEach(() => {
      vi.spyOn(console, "log").mockImplementation(() => {});
    });

    it("should transform data by placement correctly", () => {
      const mockData: PostHogSponsorAdClickData[] = [
        ["click", "banner", "Company A"],
        ["click", "sidebar", "Company A"],
        ["click", "banner", "Company A"],
        ["click", "footer", "Company B"],
        ["click", "banner", "Company B"],
      ];

      const result = transformByPlacement(mockData);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        company: "Company A",
        banner: 2,
        sidebar: 1,
      });
      expect(result).toContainEqual({
        company: "Company B",
        footer: 1,
        banner: 1,
      });
    });

    it("should handle empty array", () => {
      const result = transformByPlacement([]);
      expect(result).toEqual([]);
    });

    it("should filter out entries with no placement or sponsor", () => {
      const mockData: PostHogSponsorAdClickData[] = [
        ["click", "banner", "Company A"],
        ["click", "", "Company A"],
        ["click", "sidebar", ""],
        ["click", "footer", "Company B"],
      ];

      const result = transformByPlacement(mockData);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        company: "Company A",
        banner: 1,
      });
      expect(result).toContainEqual({
        company: "Company B",
        footer: 1,
      });
    });

    it("should accumulate clicks for same company and placement", () => {
      const mockData: PostHogSponsorAdClickData[] = [
        ["click", "banner", "Company A"],
        ["click", "banner", "Company A"],
        ["click", "banner", "Company A"],
      ];

      const result = transformByPlacement(mockData);

      expect(result).toEqual([
        {
          company: "Company A",
          banner: 3,
        },
      ]);
    });
  });

  describe("createPlacementColors", () => {
    it("should create color mapping for placements", () => {
      const placements = ["banner", "sidebar", "footer"];
      const result = createPlacementColors(placements);

      expect(result).toEqual({
        banner: "#FF0000",
        sidebar: "#00FF00",
        footer: "#0000FF",
      });
    });

    it("should handle empty placements array", () => {
      const result = createPlacementColors([]);
      expect(result).toEqual({});
    });

    it("should wrap around theme colors when placements exceed available colors", () => {
      const placements = [
        "banner",
        "sidebar",
        "footer",
        "header",
        "popup",
        "overlay",
      ];
      const result = createPlacementColors(placements);

      expect(result).toEqual({
        banner: "#FF0000",
        sidebar: "#00FF00",
        footer: "#0000FF",
        header: "#FFFF00",
        popup: "#FF00FF",
        overlay: "#FF0000", // wraps around to first color
      });
    });
  });

  describe("calculateChartHeight", () => {
    it("should calculate height based on data length", () => {
      const result = calculateChartHeight(5);
      expect(result).toBe(200); // 5 * 40 = 200
    });

    it("should respect minimum height", () => {
      const result = calculateChartHeight(1);
      expect(result).toBe(200); // Math.max(1 * 40, 200) = 200
    });

    it("should respect maximum height", () => {
      const result = calculateChartHeight(20);
      expect(result).toBe(600); // Math.min(20 * 40, 600) = 600
    });

    it("should handle zero data length", () => {
      const result = calculateChartHeight(0);
      expect(result).toBe(200); // Uses minimum height
    });
  });

  describe("generateAxisTicks", () => {
    it("should generate correct number of ticks", () => {
      const result = generateAxisTicks(5);
      expect(result).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it("should handle zero max value", () => {
      const result = generateAxisTicks(0);
      expect(result).toEqual([0]);
    });

    it("should generate ticks for larger values", () => {
      const result = generateAxisTicks(3);
      expect(result).toEqual([0, 1, 2, 3]);
    });
  });

  describe("getMaxValue", () => {
    it("should find maximum value for given key", () => {
      const data = [
        { name: "A", value: 10 },
        { name: "B", value: 25 },
        { name: "C", value: 15 },
      ];

      const result = getMaxValue(data, "value");
      expect(result).toBe(25);
    });

    it("should handle missing key in some objects", () => {
      const data = [
        { name: "A", value: 10 },
        { name: "B" }, // missing value key
        { name: "C", value: 15 },
      ];

      const result = getMaxValue(data, "value");
      expect(result).toBe(15);
    });

    it("should handle empty array", () => {
      const result = getMaxValue([], "value");
      expect(result).toBe(-Infinity);
    });

    it("should handle all undefined values", () => {
      const data = [{ name: "A" }, { name: "B" }, { name: "C" }];

      const result = getMaxValue(data, "value");
      expect(result).toBe(0);
    });

    it("should handle mixed data types", () => {
      const data = [
        { name: "A", count: 5 },
        { name: "B", count: "10" }, // string number
        { name: "C", count: 3 },
      ];

      const result = getMaxValue(data, "count");
      expect(result).toBe(10);
    });
  });
});
