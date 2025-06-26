import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { logErrorMessage } from "~bsc-shared/utils";
import { LogSubscriptionWebhookType } from "@/src/types";
import { createClient } from "@/supabase/server";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY_TEST || "";

export async function POST(req: NextRequest) {
  try {
    // 1. Get raw request body as string (for signature verification)
    const rawBody = await req.text();

    // 2. Verify Paystack webhook signature
    const paystackSignature = req.headers.get("x-paystack-signature");
    if (!paystackSignature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const computedSignature = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (paystackSignature !== computedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Parse webhook JSON payload
    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const subscriptionData = event.data;

    // 4. Handle subscription-related events
    const supabase = await createClient();

    switch (eventType) {
      case "subscription.create":
      case "subscription.activate":
      case "subscription.deactivate":
      case "subscription.suspend":
      case "subscription.resume":
      case "subscription.cancel":
      case "subscription.renewal":
      case "subscription.trial_will_end":
        const { subscription_code, customer, plan, status, start } =
          subscriptionData;

        const logSubscriptionData: LogSubscriptionWebhookType = {
          subscription_name: plan.plan_object.name,
          email: customer.email,
          subscription_code: subscription_code,
          customer_code: customer.customer_code,
          plan_code: plan.plan_object.plan_code,
          status: status,
          start_time: start,
          cancel_time:
            eventType === "subscription.cancel"
              ? new Date().toISOString()
              : null,
          raw_response: JSON.stringify(subscriptionData),
        };

        // Update subscription in Supabase by subscription_code
        const { error: upsertError } = await supabase
          .from("subscriptions")
          .update(logSubscriptionData);

        if (upsertError) {
          logErrorMessage(
            upsertError,
            "Paystack webhook: upserting subscription"
          );
          return NextResponse.json(
            { error: "Failed to upsert subscription" },
            { status: 500 }
          );
        }

        // Optionally update related profiles table here if needed

        break;

      default:
        console.log(`Unhandled Paystack webhook event: ${eventType}`);
        break;
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    logErrorMessage(error, "Paystack webhook handler");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
