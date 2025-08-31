import { addVAT } from "~bsc-shared/utils";

export enum SubscriptionTypeNames {
  StarterShowcase = "Starter Showcase (Zimbabwe)",
  GrowthAccelerator = "Growth Accelerator (Zimbabwe)",
  DealershipDominator = "Dealership Dominator (Zimbabwe)",
}

export enum SubscriptionPlanLinks {
  StarterShowcase = "https://paystack.shop/pay/buy-sell-cars-zw-starter-showcase-test",
  GrowthAccelerator = "https://paystack.shop/pay/buy-sell-cars-zw-growth-accelerator-live",
  DealershipDominator = "https://paystack.shop/pay/buy-sell-cars-zw-dealership-dominator-live",
}

export const SUBSCRIPTIONS = {
  StarterShowcase: {
    name: SubscriptionTypeNames.StarterShowcase,
    planLink: SubscriptionPlanLinks.StarterShowcase,
    price: addVAT(50, 0.15),
    basePrice: 50,
    vat: 0.15,
  },
  GrowthAccelerator: {
    name: SubscriptionTypeNames.GrowthAccelerator,
    planLink: SubscriptionPlanLinks.GrowthAccelerator,
    price: addVAT(250, 0.15),
    basePrice: 250,
    vat: 0.15,
  },
  DealershipDominator: {
    name: SubscriptionTypeNames.DealershipDominator,
    planLink: SubscriptionPlanLinks.DealershipDominator,
    price: addVAT(400, 0.15),
    basePrice: 400,
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
