import type { Metadata } from "next";
import { BASE_URL } from "@/src/constants/environments";

/**
 * Metadata for the root layout of the application.
 *
 * This is used to set the default metadata for all pages in the app.
 * Each page can override this metadata by providing its own.
 */
export const metadata: Metadata = {
  title: {
    template: "%s | BuySellCars South Africa",
    default: "BuySellCars South Africa",
  },
  description: "Buy and sell vehicles in South Africa",
  generator: "Next.js",
  applicationName: "BuySellCars South Africa",
  referrer: "origin-when-cross-origin",
  keywords: ["Buy", "Sell", "Cars", "Vehicles", "South Africa", "Marketplace"],
  creator: "Tanaka Lusengo",
  robots: {
    follow: false,
    index: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: `${BASE_URL}`,
    siteName: "BuySellCars South Africa",
    title: "BuySellCars South Africa",
    description: "Buy and sell vehicles in South Africa",
    images: [
      {
        url: `${BASE_URL}/logo/buy-sell-cars-logo.png`,
        width: 104,
        height: 98,
        alt: "Buy Sell Cars - South Africa",
      },
    ],
  },
  metadataBase: new URL(BASE_URL),
};
