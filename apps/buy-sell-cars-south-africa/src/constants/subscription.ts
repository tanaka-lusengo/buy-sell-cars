import { addVAT } from "~bsc-shared/utils";

export enum SubscriptionTypeNames {
  StarterShowcase = "Starter Showcase (South Africa)",
  GrowthAccelerator = "Growth Accelerator (South Africa)",
  DealershipDominator = "Dealership Dominator (South Africa)",
}

export enum SubscriptionPlanLinks {
  StarterShowcase = "https://paystack.shop/pay/buy-sell-cars-sa-starter-showcase-live",
  GrowthAccelerator = "https://paystack.shop/pay/buy-sell-cars-sa-growth-accelerator-live",
  DealershipDominator = "https://paystack.shop/pay/buy-sell-cars-sa-dealership-dominator-live",
}

export const SUBSCRIPTIONS = {
  StarterShowcase: {
    name: SubscriptionTypeNames.StarterShowcase,
    planLink: SubscriptionPlanLinks.StarterShowcase,
    price: addVAT(900, 0.15),
    basePrice: 900,
    vat: 0.15,
  },
  GrowthAccelerator: {
    name: SubscriptionTypeNames.GrowthAccelerator,
    planLink: SubscriptionPlanLinks.GrowthAccelerator,
    price: addVAT(4500, 0.15),
    basePrice: 4500,
    vat: 0.15,
  },
  DealershipDominator: {
    name: SubscriptionTypeNames.DealershipDominator,
    planLink: SubscriptionPlanLinks.DealershipDominator,
    price: addVAT(7200, 0.15),
    basePrice: 7200,
    vat: 0.15,
  },
};

export const SUBSCRIPTION_TYPES = [
  SubscriptionTypeNames.StarterShowcase,
  SubscriptionTypeNames.GrowthAccelerator,
  SubscriptionTypeNames.DealershipDominator,
];

// To be used in the UI to display features based on subscription type
export const SUBSCRIPTION_FEATURE_TYPES = [
  SubscriptionTypeNames.GrowthAccelerator,
  SubscriptionTypeNames.DealershipDominator,
];
