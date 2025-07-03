export enum SubscriptionTypeNames {
  StarterShowcase = "Starter Showcase (Zimbabwe)",
  GrowthAccelerator = "Growth Accelerator (Zimbabwe)",
  DealershipDominator = "Dealership Dominator (Zimbabwe)",
}

export enum SubscriptionPlanLinks {
  StarterShowcase = "https://paystack.shop/pay/buy-sell-cars-zw-starter-showcase",
  GrowthAccelerator = "https://paystack.shop/pay/buy-sell-cars-zw-growth-accelerator",
  DealershipDominator = "https://paystack.shop/pay/buy-sell-cars-zw-dealership-dominator",
}

export const SUBSCRIPTIONS = {
  StarterShowcase: {
    name: SubscriptionTypeNames.StarterShowcase,
    planLink: SubscriptionPlanLinks.StarterShowcase,
    price: 50,
  },
  GrowthAccelerator: {
    name: SubscriptionTypeNames.GrowthAccelerator,
    planLink: SubscriptionPlanLinks.GrowthAccelerator,
    price: 225,
  },
  DealershipDominator: {
    name: SubscriptionTypeNames.DealershipDominator,
    planLink: SubscriptionPlanLinks.DealershipDominator,
    price: 400,
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
