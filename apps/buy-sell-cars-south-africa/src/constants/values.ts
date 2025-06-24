export const LOCATIONS = [
  "Eastern Cape",
  "Western Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West Province",
  "Northern Cape",
];

export const DEALER_LOGOS_TO_CONTAIN = ["none"];

export enum SubscriptionTypeNames {
  DealershipFreeTrialPeriod = "Dealership Free Trial Period",
  StarterShowcase = "Starter Showcase",
  GrowthAccelerator = "Growth Accelerator",
  DealershipDominator = "Dealership Dominator",
}

export enum SubscriptionPlanIds {
  StarterShowcase = "P-6HD57828RX391013YNA7T4KQ",
  GrowthAccelerator = "P-3JB48780AW339253RNA7UBZI",
  DealershipDominator = "P-43D63817BB044991ANA7UCDY",
}

export const SUBSCRIPTIONS = {
  StarterShowcase: {
    name: SubscriptionTypeNames.StarterShowcase,
    planId: SubscriptionPlanIds.StarterShowcase,
    price: 50,
  },
  GrowthAccelerator: {
    name: SubscriptionTypeNames.GrowthAccelerator,
    planId: SubscriptionPlanIds.GrowthAccelerator,
    price: 225,
  },
  DealershipDominator: {
    name: SubscriptionTypeNames.DealershipDominator,
    planId: SubscriptionPlanIds.DealershipDominator,
    price: 400,
  },
};

export const SUBSCRIPTION_TYPES = [
  SubscriptionTypeNames.StarterShowcase,
  SubscriptionTypeNames.GrowthAccelerator,
  SubscriptionTypeNames.DealershipDominator,
];

export const SUBSCRIPTION_PLAN_MAPPING: Record<string, string> = {
  "P-6HD57828RX391013YNA7T4KQ": SubscriptionTypeNames.StarterShowcase,
  "P-3JB48780AW339253RNA7UBZI": SubscriptionTypeNames.GrowthAccelerator,
  "P-43D63817BB044991ANA7UCDY": SubscriptionTypeNames.DealershipDominator,
};

// To be used in the UI to display features based on subscription type
export const SUBSCRIPTION_FEATURE_TYPES = [
  SubscriptionTypeNames.GrowthAccelerator,
  SubscriptionTypeNames.DealershipDominator,
];
