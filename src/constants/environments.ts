export const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export const PAYPAL_API_URL_TEST = process.env.NEXT_PUBLIC_PAYPAL_API_URL_TEST
  ? `${process.env.NEXT_PUBLIC_PAYPAL_API_URL_TEST}`
  : "https://api-m.sandbox.paypal.com";

export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

export const PAYPAL_CLIENT_SECRET =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET ?? "";
