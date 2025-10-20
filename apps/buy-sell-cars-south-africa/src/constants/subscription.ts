import { addVAT } from "~bsc-shared/utils";

export enum SubscriptionTypeNames {
  CommunityAccess = "Community Access (South Africa)",
  GrowthAccelerator = "Growth Accelerator (South Africa)",
  DealershipDominator = "Dealership Dominator (South Africa)",
}

export enum SubscriptionPlanLinks {
  CommunityAccess = "", // Community Access is free, no payment link
  GrowthAccelerator = "https://paystack.shop/pay/buy-sell-cars-sa-growth-accelerator-live",
  DealershipDominator = "https://paystack.shop/pay/buy-sell-cars-sa-dealership-dominator-live",
}

export const SUBSCRIPTIONS = {
  CommunityAccess: {
    name: SubscriptionTypeNames.CommunityAccess,
    planLink: SubscriptionPlanLinks.CommunityAccess,
    price: 0,
    basePrice: 0,
    vat: 0,
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
  SubscriptionTypeNames.CommunityAccess,
  SubscriptionTypeNames.GrowthAccelerator,
  SubscriptionTypeNames.DealershipDominator,
];

// To be used in the UI to display features based on subscription type
export const SUBSCRIPTION_FEATURE_TYPES = [
  SubscriptionTypeNames.GrowthAccelerator,
  SubscriptionTypeNames.DealershipDominator,
];
