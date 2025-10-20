import { describe, it, expect } from "vitest";
import { Subscription } from "@/src/types";
import {
  hasActiveTrialAccess,
  hasTrialExpired,
  getRemainingTrialDays,
  generateTrialEndDate,
  isTrialSubscription,
} from "../trialHelpers";

describe("trialHelpers", () => {
  const mockTrialSubscription: Subscription = {
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
    ...mockTrialSubscription,
    trial_end_date: new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString(), // 7 days ago
  };

  const mockPaidSubscription: Subscription = {
    ...mockTrialSubscription,
    is_trial: false,
    trial_end_date: undefined,
  };

  describe("hasActiveTrialAccess", () => {
    it("should return true for active trial subscription", () => {
      const result = hasActiveTrialAccess(mockTrialSubscription);
      expect(result).toBe(true);
    });

    it("should return false for expired trial subscription", () => {
      const result = hasActiveTrialAccess(mockExpiredTrialSubscription);
      expect(result).toBe(false);
    });

    it("should return false for non-trial subscription", () => {
      const result = hasActiveTrialAccess(mockPaidSubscription);
      expect(result).toBe(false);
    });

    it("should return false for null subscription", () => {
      const result = hasActiveTrialAccess(null);
      expect(result).toBe(false);
    });

    it("should return false for inactive trial", () => {
      const inactiveTrial = {
        ...mockTrialSubscription,
        status: "cancelled" as const,
      };
      const result = hasActiveTrialAccess(inactiveTrial);
      expect(result).toBe(false);
    });
  });

  describe("hasTrialExpired", () => {
    it("should return true for expired trial", () => {
      const result = hasTrialExpired(mockExpiredTrialSubscription);
      expect(result).toBe(true);
    });

    it("should return false for active trial", () => {
      const result = hasTrialExpired(mockTrialSubscription);
      expect(result).toBe(false);
    });

    it("should return false for non-trial subscription", () => {
      const result = hasTrialExpired(mockPaidSubscription);
      expect(result).toBe(false);
    });

    it("should return false for null subscription", () => {
      const result = hasTrialExpired(null);
      expect(result).toBe(false);
    });
  });

  describe("getRemainingTrialDays", () => {
    it("should return correct remaining days for active trial", () => {
      const result = getRemainingTrialDays(mockTrialSubscription);
      expect(result).toBeGreaterThanOrEqual(6); // Should be 7 days or close to it
      expect(result).toBeLessThanOrEqual(7);
    });

    it("should return 0 for expired trial", () => {
      const result = getRemainingTrialDays(mockExpiredTrialSubscription);
      expect(result).toBe(0);
    });

    it("should return 0 for non-trial subscription", () => {
      const result = getRemainingTrialDays(mockPaidSubscription);
      expect(result).toBe(0);
    });

    it("should return 0 for null subscription", () => {
      const result = getRemainingTrialDays(null);
      expect(result).toBe(0);
    });
  });

  describe("generateTrialEndDate", () => {
    it("should generate a date 14 days from now", () => {
      const trialEndDate = generateTrialEndDate();
      const endDate = new Date(trialEndDate);
      const now = new Date();
      const expectedEndDate = new Date(
        now.getTime() + 14 * 24 * 60 * 60 * 1000
      );

      // Allow for small time differences due to execution time
      const timeDiff = Math.abs(endDate.getTime() - expectedEndDate.getTime());
      expect(timeDiff).toBeLessThan(1000); // Less than 1 second difference
    });

    it("should return a valid ISO string", () => {
      const trialEndDate = generateTrialEndDate();
      expect(() => new Date(trialEndDate)).not.toThrow();
      expect(trialEndDate).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });
  });

  describe("isTrialSubscription", () => {
    it("should return true for trial subscription", () => {
      const result = isTrialSubscription(mockTrialSubscription);
      expect(result).toBe(true);
    });

    it("should return false for non-trial subscription", () => {
      const result = isTrialSubscription(mockPaidSubscription);
      expect(result).toBe(false);
    });

    it("should return false for null subscription", () => {
      const result = isTrialSubscription(null);
      expect(result).toBe(false);
    });
  });
});
