import { NextResponse } from "next/server";
import {
  PAYPAL_API_URL,
  PAYPAL_WEBHOOK_ID,
} from "@/src/constants/environments";
import { SUBSCRIPTION_PLAN_MAPPING } from "@/src/constants/values";
import { getAccessToken } from "@/src/lib/paypal";
import { createClient } from "@/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const headers = Object.fromEntries(req.headers.entries());

  const transmissionId = headers["paypal-transmission-id"];
  const transmissionTime = headers["paypal-transmission-time"];
  const certUrl = headers["paypal-cert-url"];
  const authAlgo = headers["paypal-auth-algo"];
  const transmissionSig = headers["paypal-transmission-sig"];

  // Step 1: Get Access Token
  const accessToken = await getAccessToken();

  // Step 2: Verify Webhook Signature
  const verifyRes = await fetch(
    `${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: body,
      }),
    }
  );

  const verification = await verifyRes.json();

  if (verification.verification_status !== "SUCCESS") {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Step 3: Handle Event
  const eventType = body.event_type;
  const subscription = body.resource;

  const supabase = await createClient();

  const subscriptionPlanName =
    SUBSCRIPTION_PLAN_MAPPING[subscription.plan_id] ?? null;

  switch (eventType) {
    case "BILLING.SUBSCRIPTION.ACTIVATED":
    case "BILLING.SUBSCRIPTION.UPDATED":
    case "BILLING.SUBSCRIPTION.SUSPENDED":
    case "BILLING.SUBSCRIPTION.CANCELLED":
      const { error } = await supabase
        .from("subscriptions")
        .update({
          plan_id: subscription.plan_id,
          plan_name: subscriptionPlanName,
          status: subscription.status,
          email: subscription.subscriber?.email_address ?? null,
          start_time: subscription.start_time ?? null,
          cancel_time:
            eventType === "BILLING.SUBSCRIPTION.CANCELLED"
              ? subscription.status_update_time
              : null,
          raw_response: subscription,
        })
        .eq("subscription_id", subscription.id);

      if (error) {
        console.error("[SUPABASE ERROR]", error);
        return NextResponse.json(
          { error: "Failed to update subscription" },
          { status: 500 }
        );
      }

      break;
    default:
      console.log("[Unhandled Event]", eventType);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
