import { type Metadata } from "next";
import { BuySellCarsFAQs } from "@/src/components/Pages";

export const metadata: Metadata = {
  title: "Help and FAQs",
  description: "Buy Sell Cars - Frequently Asked Questions",
};

const FAQPage = async () => {
  return <BuySellCarsFAQs />;
};

export default FAQPage;
