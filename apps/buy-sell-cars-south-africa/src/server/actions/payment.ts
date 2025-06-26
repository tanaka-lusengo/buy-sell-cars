"use server";

import {
  StatusCode,
  handleServerError,
  logErrorMessage,
} from "~bsc-shared/utils";
import {
  verifySubscription,
  manageSubscription,
  getPaystackSubscription,
} from "@/src/lib/paystack/endpoints";
import type { Profile, LogSubscriptionType } from "@/src/types";
import { createClient } from "@/supabase/server";

export const getPaystackSubscriptionPlan = async (
  customerPlan: string,
  planCode: string
) => {
  if (!customerPlan || !planCode) {
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "Customer plan and plan code are required",
    };
  }

  try {
    const { data, status, error } = await getPaystackSubscription(
      customerPlan,
      planCode
    );

    if (!data || error || status !== StatusCode.SUCCESS) {
      logErrorMessage(error, "fetching paystack subscription (server)");
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Failed to fetch subscription",
      };
    }

    return {
      data,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(error, "fetching paystack subscription (server)");
  }
};

export const verifyAndLogSubscription = async (
  reference: string,
  profile: Profile
) => {
  if (!reference || !profile) {
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "Reference ID is required to log subscription",
    };
  }

  try {
    // Init supabase client
    const supabase = await createClient();

    const {
      data: subscription,
      status: subscriptionStatus,
      error: subscriptionError,
    } = await verifySubscription(reference);

    if (
      !subscription ||
      subscriptionStatus !== StatusCode.SUCCESS ||
      subscriptionError
    ) {
      logErrorMessage(subscriptionError, "verifying subscription (server)");
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Failed to verify subscription",
      };
    }

    const {
      data: paystackSubscriptionResponse,
      status,
      error,
    } = await getPaystackSubscriptionPlan(
      subscription.customer.customer_code,
      subscription.plan_object.plan_code
    );

    if (
      !paystackSubscriptionResponse ||
      status !== StatusCode.SUCCESS ||
      error
    ) {
      logErrorMessage(error, "fetching paystack subscription plan (server)");
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Failed to fetch subscription plan",
      };
    }

    const subscriptionPlanName = subscription.plan_object.name;

    const logSubscriptionData: LogSubscriptionType = {
      profile_id: profile.id,
      subscription_name: subscriptionPlanName,
      email: subscription.customer.email,
      subscription_code: paystackSubscriptionResponse.subscription_code,
      customer_code: subscription.customer.customer_code,
      plan_code: subscription.plan_object.plan_code,
      status: "active",
      start_time: subscription.paid_at,
      cancel_time: null,
      raw_response: JSON.stringify(subscription),
    };

    // --- Prevent duplicate logging ---
    // Check if a subscription with the same reference or customer_code already exists
    const { data: existingSubscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("plan_code", subscription.plan_object.plan_code)
      .eq("customer_code", subscription.customer.customer_code)
      .maybeSingle(); // Use maybeSingle to allow null if not found

    if (fetchError) {
      logErrorMessage(fetchError, "checking existing subscription (server)");
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Error checking existing subscription",
      };
    }

    if (existingSubscription) {
      // If a matching subscription exists, do not log again
      return {
        data: subscriptionPlanName,
        status: StatusCode.SUCCESS,
        error: null,
      };
    }
    // --- End duplicate check ---

    // Log subscription to the database
    const { error: logSubscriptionError } = await supabase
      .from("subscriptions")
      .insert(logSubscriptionData);

    if (logSubscriptionError) {
      logErrorMessage(logSubscriptionError, "logging subscription (server)");
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Failed to log subscription",
      };
    }

    // Also log to the profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ subscription: subscriptionPlanName })
      .eq("id", profile.id);

    if (profileError) {
      logErrorMessage(
        profileError,
        "updating profile with subscription (server)"
      );
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Failed to update profile with subscription",
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

export const getSubscription = async (profileId: string) => {
  if (!profileId) {
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "Customer profile Id is required",
    };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("profile_id", profileId)
      .single();

    if (error) {
      logErrorMessage(error, "fetching subscription (server)");
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Failed to fetch subscription",
      };
    }

    return {
      data,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(error, "fetching subscription (server)");
  }
};

export const managePaystackSubscription = async (subscriptionCode: string) => {
  if (!subscriptionCode) {
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "Plan code is required for managing subscription",
    };
  }

  try {
    const { data, status, error } = await manageSubscription(subscriptionCode);

    if (!data || error || status !== StatusCode.SUCCESS) {
      logErrorMessage(error, "managing subscription (server)");
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Failed to manage subscription",
      };
    }

    return {
      data,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(error, "managing subscription (server)");
  }
};
