import { describe, it, expect } from "vitest";
import { Subscription } from "@/src/types";
import {
  shouldVehicleBeVisible,
  getVehicleStatusMessage,
} from "../vehicleVisibilityHelpers";

describe("vehicleVisibilityHelpers", () => {
  const mockActiveTrialSubscription: Subscription = {
    id: "test-id",
    profile_id: "test-profile-id",
    email: "test@example.com",
    subscription_name: "Growth Accelerator",
    status: "active",
    plan_code: "test-plan",
    customer_code: "test-customer",
    subscription_code: "test-sub",
    start_time: "2023-01-01T00:00:00.000Z",
    cancel_time: null,
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-01T00:00:00.000Z",
    raw_response: null,
    is_trial: true,
    trial_end_date: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(), // 7 days from now
  };

  const mockExpiredTrialSubscription: Subscription = {
    ...mockActiveTrialSubscription,
    trial_end_date: new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString(), // 7 days ago
  };

  const mockPaidSubscription: Subscription = {
    ...mockActiveTrialSubscription,
    is_trial: false,
    trial_end_date: undefined,
  };

  describe("shouldVehicleBeVisible", () => {
    it("should return true for individual users", () => {
      const result = shouldVehicleBeVisible(null, "individual", null);
      expect(result).toBe(true);
    });

    it("should return true for dealerships with paid subscription", () => {
      const result = shouldVehicleBeVisible(
        mockPaidSubscription,
        "dealership",
        null
      );
      expect(result).toBe(true);
    });

    it("should return true for dealerships with active trial", () => {
      const result = shouldVehicleBeVisible(
        mockActiveTrialSubscription,
        "dealership",
        null
      );
      expect(result).toBe(true);
    });

    it("should return false for dealerships with expired trial", () => {
      const result = shouldVehicleBeVisible(
        mockExpiredTrialSubscription,
        "dealership",
        null
      );
      expect(result).toBe(false);
    });

    it("should return false for dealerships with no subscription", () => {
      const result = shouldVehicleBeVisible(null, "dealership", null);
      expect(result).toBe(false);
    });

    it("should return false for null owner category (fallback)", () => {
      const result = shouldVehicleBeVisible(null, "dealership", null);
      expect(result).toBe(false);
    });

    it("should return false for dealership with cancelled trial", () => {
      const result = shouldVehicleBeVisible(null, "dealership", null);
      expect(result).toBe(false);
    });
  });

  describe("getVehicleStatusMessage", () => {
    it("should return visible status for individual users", () => {
      const result = getVehicleStatusMessage(null, "individual", 5);
      expect(result.status).toBe("visible");
      expect(result.message).toContain("visible on the site");
      expect(result.showUpgradePrompt).toBe(false);
    });

    it("should return visible status for dealership with paid subscription", () => {
      const result = getVehicleStatusMessage(
        mockPaidSubscription,
        "dealership",
        5
      );
      expect(result.status).toBe("visible");
      expect(result.message).toContain("visible on the site");
      expect(result.showUpgradePrompt).toBe(false);
    });

    it("should return visible status for dealership with active trial", () => {
      const result = getVehicleStatusMessage(
        mockActiveTrialSubscription,
        "dealership",
        5
      );
      expect(result.status).toBe("visible");
      expect(result.message).toContain("trial");
      expect(result.showUpgradePrompt).toBe(false);
    });

    it("should return hidden status for dealership with expired trial", () => {
      const result = getVehicleStatusMessage(
        mockExpiredTrialSubscription,
        "dealership",
        5
      );
      expect(result.status).toBe("hidden");
      expect(result.message).toContain("hidden");
      expect(result.message).toContain("trial has expired");
      expect(result.showUpgradePrompt).toBe(true);
    });

    it("should return hidden status for dealership with no subscription", () => {
      const result = getVehicleStatusMessage(null, "dealership", 5);
      expect(result.status).toBe("hidden");
      expect(result.message).toContain("hidden");
      expect(result.message).toContain("Subscribe");
      expect(result.showUpgradePrompt).toBe(true);
    });

    it("should handle zero vehicles correctly", () => {
      const result = getVehicleStatusMessage(null, "dealership", 0);
      expect(result.status).toBe("hidden");
      expect(result.message).toContain("(0)");
      expect(result.showUpgradePrompt).toBe(true);
    });

    it("should handle null user category", () => {
      const result = getVehicleStatusMessage(mockPaidSubscription, null, 5);
      expect(result.status).toBe("visible");
      expect(result.showUpgradePrompt).toBe(false);
    });
  });
});
