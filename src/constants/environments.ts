// Base URL for the application
// Prefer Vercel URL if available, then NEXT_PUBLIC_BASE_URL, otherwise default to localhost
export const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "http://localhost:3000";

// PayPal Subscription (Sandbox) Values
export const PAYPAL_API_URL_SANDBOX =
  process.env.NEXT_PUBLIC_PAYPAL_API_URL_SANDBOX ||
  "https://api-m.sandbox.paypal.com";

export const PAYPAL_CLIENT_ID_SANDBOX =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX || "";

export const PAYPAL_CLIENT_SECRET_SANDBOX =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET_SANDBOX || "";

// PayPal Subscription (Live) Values
export const PAYPAL_API_URL =
  process.env.NEXT_PUBLIC_PAYPAL_API_URL || "https://api-m.paypal.com";

export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

export const PAYPAL_CLIENT_SECRET =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET || "";

// PayPal Webhook ID
export const PAYPAL_WEBHOOK_ID =
  process.env.NEXT_PUBLIC_PAYPAL_WEBHOOK_ID || "";
