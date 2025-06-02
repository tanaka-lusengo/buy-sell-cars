const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

// Base URL for the application
export const BASE_URL = isDevelopment
  ? "http://localhost:3000"
  : isProduction
    ? process.env.NEXT_PUBLIC_BASE_URL ||
      `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

// PayPal Subscription (Sandbox) Values
export const PAYPAL_API_URL_SANDBOX = process.env
  .NEXT_PUBLIC_PAYPAL_API_URL_SANDBOX
  ? `${process.env.NEXT_PUBLIC_PAYPAL_API_URL_SANDBOX}`
  : "https://api-m.sandbox.paypal.com";

export const PAYPAL_CLIENT_ID_SANDBOX =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX ?? "";

export const PAYPAL_CLIENT_SECRET_SANDBOX =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET_SANDBOX ?? "";

// PayPal Subscription (Live) Values
export const PAYPAL_API_URL_LIVE = process.env.NEXT_PUBLIC_PAYPAL_API_URL_LIVE
  ? `${process.env.NEXT_PUBLIC_PAYPAL_API_URL_LIVE}`
  : "https://api-m.paypal.com";

export const PAYPAL_CLIENT_ID_LIVE =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_LIVE ?? "";

export const PAYPAL_CLIENT_SECRET_LIVE =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET_LIVE ?? "";
