"use server";

import { revalidatePath } from "next/cache";
import {
  StatusCode,
  handleServerError,
  logErrorMessage,
} from "~bsc-shared/utils";
import { SubscriptionTypeNames } from "@/src/constants/subscription";
import { Profile, LogSubscriptionType } from "@/src/types";
import { createClient } from "@/supabase/server";

/**
 * Start Community Access plan - a permanent free plan with 20 vehicle limit
 */
export const startCommunityAccess = async (profile: Profile) => {
  try {
    const supabase = await createClient();

    // Check if user already has a subscription
    const { data: existingSubscription, error: checkError } = await supabase
      .from("subscriptions")
      .select("id, subscription_name, status")
      .eq("profile_id", profile.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected for new users
      logErrorMessage(checkError, "checking existing subscription");
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Error checking existing subscription",
      };
    }

    if (existingSubscription) {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "You already have an active subscription",
      };
    }

    // Check if user is eligible (must be dealership category)
    if (profile.user_category !== "dealership") {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Community Access is only available for dealership accounts",
      };
    }

    // Create Community Access subscription (permanent, no expiration)
    const communityAccessData: LogSubscriptionType = {
      profile_id: profile.id,
      email: profile.email,
      subscription_name: SubscriptionTypeNames.CommunityAccess,
      status: "active",
      plan_code: null,
      customer_code: null,
      subscription_code: null,
      start_time: new Date().toISOString(),
      cancel_time: null,
      raw_response: null,
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .insert(communityAccessData)
      .select()
      .single();

    if (error) {
      logErrorMessage(error, "creating Community Access subscription");
      return {
        data: null,
        status: StatusCode.INTERNAL_SERVER_ERROR,
        error: "Failed to start Community Access",
      };
    }

    // Revalidate dashboard pages
    revalidatePath("/dashboard", "layout");

    return {
      data,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(error, "starting Community Access subscription");
  }
};
