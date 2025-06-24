// Base URL for the application
// Prefer Vercel URL if available, then NEXT_PUBLIC_BASE_URL, otherwise default to localhost
export const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "http://localhost:3000";
