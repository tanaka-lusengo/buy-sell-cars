import type { Metadata } from 'next';
import { BASE_URL } from '@/src/constants/urls';

/**
 * Metadata for the root layout of the application.
 *
 * This is used to set the default metadata for all pages in the app.
 * Each page can override this metadata by providing its own.
 */
export const metadata: Metadata = {
  title: {
    template: '%s | BuySellCars Zimbabwe',
    default: 'BuySellCars Zimbabwe',
  },
  description: 'Buy and sell vehicles in Zimbabwe.',
  generator: 'Next.js',
  applicationName: 'BuySellCars Zimbabwe',
  referrer: 'origin-when-cross-origin',
  keywords: ['BuySellCars', 'Zimbabwe', 'Cars', 'Vehicles', 'Marketplace'],
  creator: 'Tanaka Lusengo @ Lusengo.Studio',
  // TODO: Set to true when app is ready for production
  robots: {
    follow: false,
    index: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: new URL(BASE_URL),
    siteName: 'BuySellCars Zimbabwe',
    title: 'BuySellCars Zimbabwe',
    description: 'Buy and sell vehicles in Zimbabwe.',
  },
  metadataBase: new URL(BASE_URL),
};
