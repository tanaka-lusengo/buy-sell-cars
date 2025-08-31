"use server";

import { revalidatePath } from "next/cache";
import {
  StatusCode,
  handleServerError,
  logErrorMessage,
} from "~bsc-shared/utils";
import { Json } from "@/database.types";
import { SubscriptionTypeNames } from "@/src/constants/subscription";
import { Profile, LogSubscriptionType } from "@/src/types";
import { generateTrialEndDate } from "@/src/utils/trialHelpers";
import { createClient } from "@/supabase/server";

/**
 * Start a 14-day trial for the Starter Showcase plan
 */
export const startStarterShowcaseTrial = async (profile: Profile) => {
  try {
    const supabase = await createClient();

    // Check if user already has a subscription
    const { data: existingSubscription, error: checkError } = await supabase
      .from("subscriptions")
      .select("id, subscription_name, is_trial, status")
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
        error: "You already have an active subscription or trial",
      };
    }

    // Check if user is eligible (must be dealership category)
    if (profile.user_category !== "dealership") {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Trials are only available for dealership accounts",
      };
    }

    // Create trial subscription
    const trialSubscriptionData: LogSubscriptionType = {
      profile_id: profile.id,
      email: profile.email,
      subscription_name: SubscriptionTypeNames.StarterShowcase,
      status: "active",
      plan_code: null,
      customer_code: null,
      subscription_code: null,
      start_time: new Date().toISOString(),
      cancel_time: null,
      raw_response: null,
      is_trial: true,
      trial_end_date: generateTrialEndDate(),
    };

    const { data, error } = await supabase
      .from("subscriptions")
      .insert(trialSubscriptionData)
      .select()
      .single();

    if (error) {
      logErrorMessage(error, "creating trial subscription");
      return {
        data: null,
        status: StatusCode.INTERNAL_SERVER_ERROR,
        error: "Failed to start trial",
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
    return handleServerError(error, "starting trial subscription");
  }
};

/**
 * Convert trial to paid subscription (called from webhook)
 */
export const convertTrialToPaid = async (
  profileId: string,
  paystackData: {
    subscription_code: string;
    customer_code: string;
    plan_code: string;
    raw_response: Record<string, unknown>;
  }
) => {
  try {
    const supabase = await createClient();

    // Find active trial for this profile
    const { data: trialSub, error: findError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("profile_id", profileId)
      .eq("is_trial", true)
      .eq("status", "active")
      .single();

    if (findError || !trialSub) {
      logErrorMessage(findError, "finding trial subscription");
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "No active trial found for this user",
      };
    }

    // Update trial to paid subscription
    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        is_trial: false,
        trial_end_date: null,
        subscription_code: paystackData.subscription_code,
        customer_code: paystackData.customer_code,
        plan_code: paystackData.plan_code,
        raw_response: paystackData.raw_response as Json,
        updated_at: new Date().toISOString(),
      })
      .eq("id", trialSub.id)
      .select()
      .single();

    if (error) {
      logErrorMessage(error, "converting trial to paid");
      return {
        data: null,
        status: StatusCode.INTERNAL_SERVER_ERROR,
        error: "Failed to convert trial to paid subscription",
      };
    }

    return {
      data,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(error, "converting trial to paid subscription");
  }
};
