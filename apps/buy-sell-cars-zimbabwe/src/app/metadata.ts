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
    template: "%s | BuySellCars Zimbabwe",
    default: "BuySellCars Zimbabwe",
  },
  description: "Buy and sell vehicles in Zimbabwe.",
  generator: "Next.js",
  applicationName: "BuySellCars Zimbabwe",
  referrer: "origin-when-cross-origin",
  keywords: ["Buy", "Sell", "Cars", "Vehicles", "Zimbabwe", "Marketplace"],
  creator: "Tanaka Lusengo",
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: `${BASE_URL}`,
    siteName: "BuySellCars Zimbabwe",
    title: "BuySellCars Zimbabwe",
    description: "Buy and sell vehicles in Zimbabwe.",
    images: [
      {
        url: `${BASE_URL}/logo/buy-sell-cars-logo.png`,
        width: 104,
        height: 98,
        alt: "Buy Sell Cars - Zimbabwe",
      },
    ],
  },
  metadataBase: new URL(BASE_URL),
};
