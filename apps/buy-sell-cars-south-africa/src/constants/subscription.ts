export enum SubscriptionTypeNames {
  DealershipFreeTrialPeriod = "Dealership Free Trial Period",
  StarterShowcase = "Starter Showcase (South Africa)",
  GrowthAccelerator = "Growth Accelerator (South Africa)",
  DealershipDominator = "Dealership Dominator (South Africa)",
}

export enum SubscriptionPlanLinks {
  StarterShowcase = "https://paystack.shop/pay/buy-sell-cars-sa-starter-showcase-plan",
  GrowthAccelerator = "https://paystack.shop/pay/buy-sell-cars-sa-growth-accelerator-plan",
  DealershipDominator = "https://paystack.shop/pay/buy-sell-cars-sa-dealership-dominator-plan",
}

export const SUBSCRIPTIONS = {
  StarterShowcase: {
    name: SubscriptionTypeNames.StarterShowcase,
    planLink: SubscriptionPlanLinks.StarterShowcase,
    price: 890,
  },
  GrowthAccelerator: {
    name: SubscriptionTypeNames.GrowthAccelerator,
    planLink: SubscriptionPlanLinks.GrowthAccelerator,
    price: 3995,
  },
  DealershipDominator: {
    name: SubscriptionTypeNames.DealershipDominator,
    planLink: SubscriptionPlanLinks.DealershipDominator,
    price: 7105,
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
