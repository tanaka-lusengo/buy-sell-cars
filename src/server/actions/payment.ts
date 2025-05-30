"use server";

import {
  createSubscription,
  retrieveSubscription,
} from "@/src/lib/paypal/index";
import type {
  SubscribeToSubscriptionResponse,
  SubscriptionResponse,
} from "@/src/lib/paypal/types";
import type { Profile, LogSubscription } from "@/src/types";
import { handleServerError, StatusCode } from "@/src/utils";
import { SUBSCRIPTION_PLAN_MAPPING } from "@/src/constants/values";
import { createClient } from "@/supabase/server";

export const subscribeToPlan = async (profile: Profile, planId: string) => {
  try {
    if (!planId) {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Plan ID is required to create a subscription",
      };
    }

    if (!profile) {
      return {
        data: null,
        status: StatusCode.UNAUTHORIZED,
        error: "User profile is required to create a subscription",
      };
    }

    // Attempt to create a subscription using PayPal integration
    const subscription: SubscribeToSubscriptionResponse =
      await createSubscription(profile, planId);

    // Return success response with subscription data
    return {
      status: StatusCode.SUCCESS,
      data: subscription,
      error: null,
    };
  } catch (error) {
    return handleServerError(error, "creating subscription (server)");
  }
};

export const logPaypalSubscription = async (subscription_id: string) => {
  try {
    if (!subscription_id) {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Subscription ID is required to log subscription",
      };
    }

    // Init supabase client
    const supabase = await createClient();

    const subscription: SubscriptionResponse =
      await retrieveSubscription(subscription_id);

    if (!subscription) {
      throw new Error("Failed to retrieve subscription from PayPal");
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const subscriptionPlanName =
      SUBSCRIPTION_PLAN_MAPPING[subscription.plan_id] ?? null;

    const logSubscriptionData: LogSubscription = {
      profile_id: user.id,
      subscription_id,
      plan_id: subscription.plan_id,
      plan_name: subscriptionPlanName,
      status: subscription.status,
      email: subscription.subscriber?.email_address ?? null,
      start_time: subscription.start_time ?? null,
      raw_response: subscription,
    };

    // Upsert subscription log
    const { error: logSubscriptionError } = await supabase
      .from("subscriptions")
      .upsert(logSubscriptionData);

    if (logSubscriptionError) {
      return {
        data: null,
        status: StatusCode.INTERNAL_SERVER_ERROR,
        error: logSubscriptionError,
      };
    }

    // Also log to the profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ subscription: subscriptionPlanName })
      .eq("id", user.id);

    if (profileError) {
      return {
        data: null,
        status: StatusCode.INTERNAL_SERVER_ERROR,
        error: profileError,
      };
    }

    return {
      data: subscriptionPlanName,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(error, "logging subscription (server)");
  }
};
