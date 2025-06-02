import { type Profile } from "../../types";
import {
  BASE_URL,
  PAYPAL_CLIENT_ID_LIVE,
  PAYPAL_CLIENT_SECRET_LIVE,
  PAYPAL_API_URL_LIVE,
} from "@/src/constants/environments";

export const getAccessToken = async () => {
  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID_LIVE}:${PAYPAL_CLIENT_SECRET_LIVE}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API_URL_LIVE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await res.json();
  return data.access_token;
};

export const createSubscription = async (profile: Profile, planId: string) => {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_URL_LIVE}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      subscriber: {
        email_address: profile.email,
      },
      application_context: {
        brand_name: "Buy Sell Cars Marketplace",
        return_url: `${BASE_URL}/payment/success`,
        cancel_url: `${BASE_URL}/payment/cancel`,
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`PayPal subscription creation failed: ${error}`);
  }

  return await res.json();
};

export const retrieveSubscription = async (subscriptionId: string) => {
  const accessToken = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_API_URL_LIVE}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to retrieve subscription: ${error}`);
  }

  return await res.json();
};

export const suspendSubscription = async (subscriptionId: string) => {
  const accessToken = await getAccessToken();
  const res = await fetch(
    `${PAYPAL_API_URL_LIVE}/v1/billing/subscriptions/${subscriptionId}/suspend`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: "User requested suspension",
      }),
    }
  );
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to suspend subscription: ${error}`);
  }
  return await res.json();
};

export const cancelSubscription = async (subscriptionId: string) => {
  const accessToken = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_API_URL_LIVE}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: "User requested cancellation",
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to cancel subscription: ${error}`);
  }

  return await res.json();
};

export const updateSubscription = async (
  subscriptionId: string,
  planId: string
) => {
  const accessToken = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_API_URL_LIVE}/v1/billing/subscriptions/${subscriptionId}/revise`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: planId,
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update subscription: ${error}`);
  }

  return await res.json();
};
