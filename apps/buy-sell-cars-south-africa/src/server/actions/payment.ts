"use server";

import { User } from "@supabase/supabase-js";
import { addDays } from "date-fns";
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
import { LogSubscriptionType, Profile } from "@/src/types";
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

export const verifySubscriptionReference = async (reference: string) => {
  if (!reference) {
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "Reference ID is required for verification",
    };
  }

  try {
    const { data, status, error } = await verifySubscription(reference);

    if (!data || error || status !== StatusCode.SUCCESS) {
      logErrorMessage(error, "verifying subscription reference (server)");
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Failed to verify subscription",
      };
    }

    // Just return the verification data - webhook will handle logging
    return {
      data: {
        subscription_reference: reference,
        customer_email: data.customer.email,
        plan_name: data.plan_object.name,
        status: data.status,
      },
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(
      error,
      "verifying subscription reference (server)"
    );
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
      error: "Subscription code is required for managing subscription",
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

export const syncPartialSubscriptions = async () => {
  try {
    const supabase = await createClient();

    // Find subscriptions that are missing subscription_code
    const { data: partialSubscriptions, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .is("subscription_code", null)
      .eq("status", "active");

    if (fetchError) {
      logErrorMessage(fetchError, "fetching partial subscriptions (server)");
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Failed to fetch partial subscriptions",
      };
    }

    if (!partialSubscriptions || partialSubscriptions.length === 0) {
      return {
        data: { synced: 0, message: "No partial subscriptions found" },
        status: StatusCode.SUCCESS,
        error: null,
      };
    }

    let syncedCount = 0;
    const errors = [];

    for (const subscription of partialSubscriptions) {
      try {
        const {
          data: paystackSub,
          status,
          error,
        } = await getPaystackSubscription(
          subscription.customer_code!,
          subscription.plan_code!
        );

        if (paystackSub && status === StatusCode.SUCCESS && !error) {
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({
              subscription_code: paystackSub.subscription_code,
              subscription_name: subscription.subscription_name?.replace(
                " (Pending Sync)",
                ""
              ),
              updated_at: new Date().toISOString(),
            })
            .eq("id", subscription.id);

          if (!updateError) {
            syncedCount++;
          } else {
            errors.push(
              `Failed to update subscription ${subscription.id}: ${updateError.message}`
            );
          }
        } else {
          errors.push(
            `Failed to fetch subscription for ${subscription.email}: ${error}`
          );
        }
      } catch (error) {
        errors.push(`Error syncing subscription ${subscription.id}: ${error}`);
      }
    }

    return {
      data: {
        synced: syncedCount,
        total: partialSubscriptions.length,
        errors: errors.length > 0 ? errors : null,
      },
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(error, "syncing partial subscriptions (server)");
  }
};

export const logPartialTrialSubscription = async (
  profile: Profile,
  subscriptionName: string
) => {
  if (!profile || !subscriptionName) {
    console.error("Profile and subscription name are required");
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "Profile and subscription name are required",
    };
  }

  const supabase = await createClient();

  const logSubscriptionData: LogSubscriptionType & {
    trial_ends_at: string;
  } = {
    profile_id: profile.id,
    subscription_name: subscriptionName,
    email: profile.email,
    subscription_code: null,
    customer_code: null,
    plan_code: null,
    status: "active (trial period)",
    start_time: null,
    cancel_time: null,
    trial_ends_at: addDays(new Date(), 30).toISOString(),
    raw_response: null,
  };

  const { error: insertError } = await supabase
    .from("subscriptions")
    .insert(logSubscriptionData);

  if (insertError) {
    console.error("Error logging partial subscription:", insertError.message);
    return {
      data: null,
      status: StatusCode.INTERNAL_SERVER_ERROR,
      error: "Failed to log partial subscription",
    };
  }

  return {
    data: logSubscriptionData,
    status: StatusCode.SUCCESS,
    error: null,
  };
};

export const logSubscription = async (
  user: User,
  subscriptionData: LogSubscriptionType
) => {
  if (!user || !subscriptionData) {
    console.error("User and subscription data are required");
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "User and subscription data are required",
    };
  }

  const supabase = await createClient();

  const logSubscriptionData: LogSubscriptionType = {
    ...subscriptionData,
    profile_id: user.id,
    email: user.email || "",
    subscription_name: subscriptionData.subscription_name,
    start_time: new Date().toISOString(),
  };

  const { error: insertError } = await supabase
    .from("subscriptions")
    .insert(logSubscriptionData);

  if (insertError) {
    console.error("Error logging subscription:", insertError.message);
    return {
      data: null,
      status: StatusCode.INTERNAL_SERVER_ERROR,
      error: "Failed to log subscription",
    };
  }

  return {
    data: logSubscriptionData,
    status: StatusCode.SUCCESS,
    error: null,
  };
};
