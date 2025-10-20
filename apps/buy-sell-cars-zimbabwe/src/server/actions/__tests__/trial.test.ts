import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { StatusCode } from "~bsc-shared/utils";
import { Profile } from "@/src/types";
import { convertTrialToPaid, startCommunityAccess } from "../trial";

// Mock the Supabase client
const mockSupabaseClient = {
  from: vi.fn(() => mockSupabaseClient),
  select: vi.fn(() => mockSupabaseClient),
  insert: vi.fn(() => mockSupabaseClient),
  update: vi.fn(() => mockSupabaseClient),
  eq: vi.fn(() => mockSupabaseClient),
  single: vi.fn(),
};

// Mock the Supabase server module
vi.mock("@/supabase/server", () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseClient)),
}));

// Mock revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock utils
vi.mock("~bsc-shared/utils", async () => {
  const actual = await vi.importActual("~bsc-shared/utils");
  return {
    ...actual,
    logErrorMessage: vi.fn(),
    handleServerError: vi.fn((error: unknown, context: string) => ({
      data: null,
      status: StatusCode.INTERNAL_SERVER_ERROR,
      error: `Server error in ${context}`,
    })),
  };
});

describe("trial actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("convertTrialToPaid", () => {
    const mockProfileId = "test-profile-id";
    const mockPaystackData = {
      subscription_code: "sub_123",
      customer_code: "cus_123",
      plan_code: "plan_123",
      raw_response: { test: "data" },
    };

    it("should successfully convert trial to paid subscription", async () => {
      // Mock finding active trial
      const mockTrial = { id: "trial-sub-id" };
      mockSupabaseClient.single
        .mockResolvedValueOnce({ data: mockTrial, error: null })
        .mockResolvedValueOnce({
          data: {
            ...mockTrial,
            is_trial: false,
            trial_end_date: null,
            subscription_code: mockPaystackData.subscription_code,
          },
          error: null,
        });

      const result = await convertTrialToPaid(mockProfileId, mockPaystackData);

      expect(result.status).toBe(StatusCode.SUCCESS);
      expect(result.error).toBeNull();
      expect(result.data).toBeTruthy();

      // Verify the correct database calls were made
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("subscriptions");
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith(
        "profile_id",
        mockProfileId
      );
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith("is_trial", true);
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith("status", "active");
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(
        expect.objectContaining({
          is_trial: false,
          trial_end_date: null,
          subscription_code: mockPaystackData.subscription_code,
          customer_code: mockPaystackData.customer_code,
          plan_code: mockPaystackData.plan_code,
        })
      );
    });

    it("should return error when no active trial is found", async () => {
      // Mock no trial found
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116", message: "No rows found" },
      });

      const result = await convertTrialToPaid(mockProfileId, mockPaystackData);

      expect(result.status).toBe(StatusCode.BAD_REQUEST);
      expect(result.error).toBe("No active trial found for this user");
      expect(result.data).toBeNull();
    });

    it("should return error when database update fails", async () => {
      // Mock finding trial but update fails
      const mockTrial = { id: "trial-sub-id" };
      mockSupabaseClient.single
        .mockResolvedValueOnce({ data: mockTrial, error: null })
        .mockResolvedValueOnce({
          data: null,
          error: { message: "Update failed" },
        });

      const result = await convertTrialToPaid(mockProfileId, mockPaystackData);

      expect(result.status).toBe(StatusCode.INTERNAL_SERVER_ERROR);
      expect(result.error).toBe("Failed to convert trial to paid subscription");
      expect(result.data).toBeNull();
    });

    it("should handle database errors gracefully", async () => {
      // Mock database error
      mockSupabaseClient.single.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      const result = await convertTrialToPaid(mockProfileId, mockPaystackData);

      expect(result.status).toBe(StatusCode.INTERNAL_SERVER_ERROR);
      expect(result.error).toBe(
        "Server error in converting trial to paid subscription"
      );
      expect(result.data).toBeNull();
    });

    it("should validate required parameters", async () => {
      const invalidData = {
        subscription_code: "",
        customer_code: "",
        plan_code: "",
        raw_response: {},
      };

      // The function should still try to process but may fail during validation
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: "No trial found" },
      });

      const result = await convertTrialToPaid("", invalidData);

      expect(result.status).toBe(StatusCode.BAD_REQUEST);
      expect(result.data).toBeNull();
    });
  });

  describe("startCommunityAccess", () => {
    const mockProfile = {
      id: "test-profile-id",
      email: "test@example.com",
      user_category: "dealership" as const,
      created_at: "2023-01-01T00:00:00.000Z",
      updated_at: "2023-01-01T00:00:00.000Z",
      dealership_name: "Test Dealership",
      first_name: "John",
      last_name: "Doe",
      profile_logo_path: null,
      phone: null,
      government_id_path: null,
      is_verified: false,
      admin: false,
      address: null,
      description: null,
      is_feature: null,
      location: null,
      show_vehicles: null,
    } satisfies Profile;

    it("should successfully start Community Access for eligible dealership", async () => {
      // Mock no existing subscription
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116", message: "No rows found" },
      });

      // Mock successful insert
      const mockCommunityAccessData = {
        id: "new-community-access-id",
        profile_id: mockProfile.id,
        is_trial: false,
        trial_end_date: null,
      };
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: mockCommunityAccessData,
        error: null,
      });

      const result = await startCommunityAccess(mockProfile);

      expect(result.status).toBe(StatusCode.SUCCESS);
      expect(result.error).toBeNull();
      expect(result.data).toBeTruthy();

      // Verify insert was called with correct data (no trial, no expiration)
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          profile_id: mockProfile.id,
          email: mockProfile.email,
          is_trial: false,
          status: "active",
        })
      );
    });

    it("should reject Community Access for individual users", async () => {
      const individualProfile = {
        ...mockProfile,
        user_category: "individual" as const,
      };

      // Mock Supabase call even though validation should happen before it's reached
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116", message: "No rows found" },
      });

      const result = await startCommunityAccess(individualProfile);

      expect(result.status).toBe(StatusCode.BAD_REQUEST);
      expect(result.error).toBe(
        "Community Access is only available for dealership accounts"
      );
      expect(result.data).toBeNull();
    });

    it("should reject Community Access when user already has subscription", async () => {
      // Mock existing subscription
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id: "existing-sub" },
        error: null,
      });

      const result = await startCommunityAccess(mockProfile);

      expect(result.status).toBe(StatusCode.BAD_REQUEST);
      expect(result.error).toBe("You already have an active subscription");
      expect(result.data).toBeNull();
    });
  });
});
