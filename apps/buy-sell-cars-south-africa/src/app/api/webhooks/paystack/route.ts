import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { LogSubscriptionWebhookType } from "@/src/types";
import { createClientServiceRole } from "@/supabase/server";

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
    const subscriptionData = res.data;

    console.log(`[${requestId}] Event type: ${eventType}`);
    console.log(
      `[${requestId}] Customer: ${subscriptionData?.customer?.email || "N/A"}`
    );

    // 4. Handle subscription-related events
    const supabase = await createClientServiceRole();

    switch (eventType) {
      case "subscription.disable":
      case "subscription.not_renew":
        // Add validation before destructuring
        if (
          !subscriptionData ||
          !subscriptionData.customer ||
          !subscriptionData.plan
        ) {
          console.error(`[${requestId}] Missing required subscription data`);
          return NextResponse.json(
            { error: "Invalid payload structure" },
            { status: 400 }
          );
        }

        const { subscription_code, customer, plan, status, next_payment_date } =
          subscriptionData || {};

        // 5. First, find the profile_id using customer email
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
          return NextResponse.json(
            { error: "Profile not found for customer email" },
            { status: 404 }
          );
        }

        const profile = profiles[0];

        const logSubscriptionData: LogSubscriptionWebhookType = {
          profile_id: profile.id,
          customer_code: customer.customer_code,
          updated_at: new Date().toISOString(),
          subscription_name: plan.name,
          plan_code: plan.plan_code,
          subscription_code: subscription_code,
          email: customer.email,
          status: status,
          next_payment_date,
          cancel_time:
            eventType === "subscription.not_renew"
              ? new Date().toISOString()
              : null,
          raw_response: JSON.stringify(subscriptionData),
        };

        // 6. Use upsert to handle both update scenarios
        const { data, error: upsertError } = await supabase
          .from("subscriptions")
          .upsert(logSubscriptionData, {
            onConflict: "subscription_code",
            ignoreDuplicates: false,
          })
          .select();

        if (upsertError) {
          console.error(
            `[${requestId}] Error upserting subscription:`,
            upsertError
          );
          return NextResponse.json(
            { error: "Failed to upsert subscription" },
            { status: 500 }
          );
        }

        // Also log to the profiles table
        const { error: updateProfileError } = await supabase
          .from("profiles")
          .update({ subscription: `Status: ${status}` })
          .eq("id", profile.id);

        if (updateProfileError) {
          console.error(
            `[${requestId}] Error updating profile subscription:`,
            updateProfileError
          );
          return NextResponse.json(
            { error: "Failed to update profile subscription" },
            { status: 500 }
          );
        }

        console.log(`[${requestId}] Subscription processed successfully:`, {
          subscription_code,
          status,
          rows_affected: data?.length || 0,
        });
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
