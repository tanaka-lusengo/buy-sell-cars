import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { StatusCode, logErrorMessage } from "~bsc-shared/utils";
import {
  verifySubscription,
  getPaystackSubscription,
} from "@/src/lib/paystack/endpoints";
import { LogSubscriptionType } from "@/src/types";
import { createClientServiceRole } from "@/supabase/server";

/**
 * Paystack Webhook Handler
 *
 * Handles the following subscription events:
 * - charge.success: Processes subscription charges and creates/updates subscription records
 * - subscription.disable: Marks subscription as disabled
 * - subscription.not_renew: Marks subscription as cancelled with cancel_time
 *
 * This webhook verifies subscription details with Paystack and prevents duplicate
 * database entries by updating existing subscriptions instead of creating new rows
 * when users resubscribe.
 */

const PAYSTACK_SECRET =
  process.env.NODE_ENV === "production"
    ? process.env.PAYSTACK_SECRET_KEY_LIVE
    : process.env.PAYSTACK_SECRET_KEY_TEST;

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Paystack webhook request received`);

  if (!PAYSTACK_SECRET) {
    console.error(`[${requestId}] Paystack secret key not configured`);
    return NextResponse.json(
      { error: "Paystack secret key not configured" },
      { status: 500 }
    );
  }

  try {
    // 1. Get raw request body as string (for signature verification)
    const rawBody = await req.text();

    // 2. Verify Paystack webhook signature
    const paystackSignature = req.headers.get("x-paystack-signature");
    if (!paystackSignature) {
      console.warn(`[${requestId}] Missing Paystack signature header`);
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    console.log(`[${requestId}] Verifying webhook signature...`);
    const computedSignature = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (paystackSignature !== computedSignature) {
      console.error(`[${requestId}] Invalid webhook signature`);
      console.error(`[${requestId}] Expected: ${computedSignature}`);
      console.error(`[${requestId}] Received: ${paystackSignature}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log(`[${requestId}] Webhook signature verified successfully!`);

    // 3. Parse webhook JSON payload
    const res = JSON.parse(rawBody);
    const eventType = res.event;
    const eventData = res.data;

    console.log(`[${requestId}] Event type: ${eventType}`);
    console.log(
      `[${requestId}] Customer: ${eventData?.customer?.email || "N/A"}`
    );

    // 4. Handle subscription-related events
    const supabase = await createClientServiceRole();

    switch (eventType) {
      case "charge.success":
        // Check if this is a subscription charge (has plan object and recurring metadata)
        if (eventData?.plan && eventData?.metadata?.custom_filters?.recurring) {
          await handleSubscriptionChargeWithRetry(
            supabase,
            eventData,
            requestId
          );
        } else {
          console.log(
            `[${requestId}] Charge success for non-subscription payment`
          );
        }
        break;

      case "subscription.disable":
      case "subscription.not_renew":
        await handleSubscriptionCancelDisable(
          supabase,
          eventData,
          eventType,
          requestId
        );
        break;

      default:
        console.log(
          `[${requestId}] Unhandled Paystack webhook event: ${eventType}`
        );
        console.log(
          `[${requestId}] Raw payload:`,
          JSON.stringify(res, null, 2)
        );
        break;
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error(`[${requestId}] Error processing Paystack webhook:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to handle subscription charges from charge.success events
async function handleSubscriptionCharge(
  supabase: any,
  chargeData: any,
  requestId: string
) {
  console.log(
    `[${requestId}] Processing charge.success event for subscription`
  );

  if (!chargeData || !chargeData.customer || !chargeData.plan) {
    console.error(
      `[${requestId}] Missing required charge data for subscription`
    );
    throw new Error("Invalid payload structure for subscription charge");
  }

  const { customer, plan, paid_at, reference } = chargeData;

  // Find the profile using customer email
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", customer.email)
    .limit(1);

  if (profileError || !profiles || profiles.length === 0) {
    console.error(
      `[${requestId}] Profile not found for email: ${customer.email}`,
      profileError
    );
    throw new Error(`Profile not found for customer email: ${customer.email}`);
  }

  const profile = profiles[0];

  // Get the subscription_code from Paystack using customer_code and plan_code
  console.log(`[${requestId}] Fetching subscription details from Paystack...`);

  try {
    const {
      data: paystackSubscriptionResponse,
      status: paystackStatus,
      error: paystackError,
    } = await getPaystackSubscription(customer.customer_code, plan.plan_code);

    if (
      !paystackSubscriptionResponse ||
      paystackStatus !== StatusCode.SUCCESS ||
      paystackError
    ) {
      logErrorMessage(
        paystackError,
        `fetching paystack subscription plan (webhook) [${requestId}]`
      );
      throw new Error("Failed to fetch subscription plan from Paystack");
    }

    const logSubscriptionData: LogSubscriptionType = {
      profile_id: profile.id,
      subscription_name: plan.name,
      email: customer.email,
      subscription_code: paystackSubscriptionResponse.subscription_code,
      customer_code: customer.customer_code,
      plan_code: plan.plan_code,
      status: "active",
      start_time: paid_at || new Date().toISOString(),
      cancel_time: null,
      raw_response: JSON.stringify(chargeData),
    };

    // Check if subscription already exists for this user and plan
    const { data: existingSubscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("plan_code", plan.plan_code)
      .eq("customer_code", customer.customer_code)
      .maybeSingle();

    if (fetchError) {
      logErrorMessage(
        fetchError,
        `checking existing subscription (webhook) [${requestId}]`
      );
      throw new Error("Error checking existing subscription");
    }

    if (existingSubscription) {
      // Update existing subscription instead of creating a new one
      console.log(
        `[${requestId}] Updating existing subscription for customer: ${customer.email}`
      );

      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          ...logSubscriptionData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSubscription.id);

      if (updateError) {
        logErrorMessage(
          updateError,
          `updating subscription (webhook) [${requestId}]`
        );
        throw new Error("Failed to update subscription");
      }

      console.log(
        `[${requestId}] Successfully updated subscription: ${paystackSubscriptionResponse.subscription_code}`
      );
    } else {
      // Create new subscription
      console.log(
        `[${requestId}] Creating new subscription for customer: ${customer.email}`
      );

      const { error: insertError } = await supabase
        .from("subscriptions")
        .insert(logSubscriptionData);

      if (insertError) {
        logErrorMessage(
          insertError,
          `creating subscription (webhook) [${requestId}]`
        );
        throw new Error("Failed to create subscription");
      }

      console.log(
        `[${requestId}] Successfully created subscription: ${paystackSubscriptionResponse.subscription_code}`
      );
    }
  } catch (error) {
    console.error(
      `[${requestId}] Error in subscription charge handler:`,
      error
    );
    throw error;
  }
}

// Helper function to handle charge.success events with retry logic for subscription_code
async function handleSubscriptionChargeWithRetry(
  supabase: any,
  chargeData: any,
  requestId: string,
  retryCount = 0
) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  try {
    await handleSubscriptionCharge(supabase, chargeData, requestId);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (
      retryCount < MAX_RETRIES &&
      errorMessage.includes("Failed to fetch subscription plan from Paystack")
    ) {
      console.warn(
        `[${requestId}] Retrying subscription fetch (attempt ${retryCount + 1}/${MAX_RETRIES}) after ${RETRY_DELAY}ms`
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

      return handleSubscriptionChargeWithRetry(
        supabase,
        chargeData,
        requestId,
        retryCount + 1
      );
    }

    // If we've exhausted retries or it's a different error, try to create a partial record
    if (retryCount >= MAX_RETRIES) {
      console.error(
        `[${requestId}] Max retries exceeded, creating partial subscription record`
      );
      await createPartialSubscriptionRecord(supabase, chargeData, requestId);
    } else {
      throw error;
    }
  }
}

// Helper function to create a partial subscription record when Paystack API fails
async function createPartialSubscriptionRecord(
  supabase: any,
  chargeData: any,
  requestId: string
) {
  console.log(
    `[${requestId}] Creating partial subscription record due to Paystack API issues`
  );

  const { customer, plan, paid_at } = chargeData;

  // Find the profile using customer email
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", customer.email)
    .limit(1);

  if (profileError || !profiles || profiles.length === 0) {
    console.error(
      `[${requestId}] Profile not found for partial record: ${customer.email}`
    );
    return;
  }

  const profile = profiles[0];

  const partialSubscriptionData: LogSubscriptionType = {
    profile_id: profile.id,
    subscription_name: `${plan.name} (Pending Sync)`,
    email: customer.email,
    subscription_code: null, // Will be updated later when Paystack API is available
    customer_code: customer.customer_code,
    plan_code: plan.plan_code,
    status: "active",
    start_time: paid_at || new Date().toISOString(),
    cancel_time: null,
    raw_response: JSON.stringify(chargeData),
  };

  // Check if subscription already exists
  const { data: existingSubscription, error: fetchError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("plan_code", plan.plan_code)
    .eq("customer_code", customer.customer_code)
    .maybeSingle();

  if (!fetchError && existingSubscription) {
    // Update existing subscription
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        ...partialSubscriptionData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingSubscription.id);

    if (updateError) {
      console.error(
        `[${requestId}] Failed to update partial subscription record:`,
        updateError
      );
    } else {
      console.log(
        `[${requestId}] Updated partial subscription record for: ${customer.email}`
      );
    }
  } else {
    // Create new partial subscription
    const { error: insertError } = await supabase
      .from("subscriptions")
      .insert(partialSubscriptionData);

    if (insertError) {
      console.error(
        `[${requestId}] Failed to create partial subscription record:`,
        insertError
      );
    } else {
      console.log(
        `[${requestId}] Created partial subscription record for: ${customer.email}`
      );
    }
  }
}

// Helper function to handle subscription cancellation/disable
async function handleSubscriptionCancelDisable(
  supabase: any,
  subscriptionData: any,
  eventType: string,
  requestId: string
) {
  console.log(`[${requestId}] Processing ${eventType} event`);

  if (
    !subscriptionData ||
    !subscriptionData.customer ||
    !subscriptionData.plan
  ) {
    console.error(
      `[${requestId}] Missing required subscription data for ${eventType} event`
    );
    throw new Error(`Invalid payload structure for ${eventType}`);
  }

  const { subscription_code, customer, plan, status } = subscriptionData;

  // Find the profile using customer email
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", customer.email)
    .limit(1);

  if (profileError || !profiles || profiles.length === 0) {
    console.error(
      `[${requestId}] Profile not found for email: ${customer.email}`,
      profileError
    );
    throw new Error(`Profile not found for customer email: ${customer.email}`);
  }

  const profile = profiles[0];

  // Update the existing subscription status
  const updateData = {
    status: status,
    updated_at: new Date().toISOString(),
    subscription_name:
      eventType === "subscription.not_renew"
        ? `${plan.name} - Cancelled`
        : `${plan.name} - Disabled`,
    cancel_time:
      eventType === "subscription.not_renew" ? new Date().toISOString() : null,
    raw_response: JSON.stringify(subscriptionData),
  };

  const { data, error: updateError } = await supabase
    .from("subscriptions")
    .update(updateData)
    .eq("subscription_code", subscription_code)
    .eq("profile_id", profile.id)
    .select();

  if (updateError) {
    logErrorMessage(
      updateError,
      `updating subscription for ${eventType} (webhook) [${requestId}]`
    );
    throw new Error(`Failed to update subscription for ${eventType}`);
  }

  if (!data || data.length === 0) {
    console.warn(
      `[${requestId}] No subscription found to update for code: ${subscription_code}`
    );
    // Optionally create a new record if subscription doesn't exist
    const logSubscriptionData: LogSubscriptionType = {
      profile_id: profile.id,
      subscription_name: updateData.subscription_name,
      email: customer.email,
      subscription_code: subscription_code,
      customer_code: customer.customer_code,
      plan_code: plan.plan_code,
      status: status,
      start_time: null, // Unknown start time for existing subscription
      cancel_time: updateData.cancel_time,
      raw_response: JSON.stringify(subscriptionData),
    };

    const { error: insertError } = await supabase
      .from("subscriptions")
      .insert(logSubscriptionData);

    if (insertError) {
      logErrorMessage(
        insertError,
        `creating subscription record for ${eventType} (webhook) [${requestId}]`
      );
      throw new Error(`Failed to create subscription record for ${eventType}`);
    }

    console.log(
      `[${requestId}] Created new subscription record for ${eventType}: ${subscription_code}`
    );
  } else {
    console.log(
      `[${requestId}] Successfully updated subscription for ${eventType}: ${subscription_code}`
    );
  }
}
