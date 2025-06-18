export const CAR_CONDITIONS = ["New", "Used"];

export const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid"];

export const GEARBOX_TYPES = ["Manual", "Automatic"];

export const USER_CATEGORYS = ["Individual", "Dealership"];

export const VEHICLE_CATEGORIES = [
  "Car",
  "Boat",
  "Bike",
  "Truck",
  "Agriculture",
  "Earth moving",
];

export const LISTING_TYPES = ["Rental", "For Sale"];

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

export const DEALER_LOGOS_TO_CONTAIN = ["temp"];

// PayPal Subscription (Live) Values
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

// PayPal Subscription (Sandbox) Values
export enum SubscriptionPlanIdsSandbox {
  StarterShowcase = "P-4CT11633YD924925YNA7UGWI",
  GrowthAccelerator = "P-76S98886UE9698412NA7UHBQ",
  DealershipDominator = "P-72904676AK612564LNA7UHJY",
}

export const SUBSCRIPTION_PLAN_MAPPING_SANDBOX: Record<string, string> = {
  "P-4CT11633YD924925YNA7UGWI": SubscriptionTypeNames.StarterShowcase,
  "P-76S98886UE9698412NA7UHBQ": SubscriptionTypeNames.GrowthAccelerator,
  "P-72904676AK612564LNA7UHJY": SubscriptionTypeNames.DealershipDominator,
};

export const SUBSCRIPTIONS_SANDBOX = {
  StarterShowcase: {
    name: SubscriptionTypeNames.StarterShowcase,
    planId: SubscriptionPlanIdsSandbox.StarterShowcase,
    price: 50,
  },
  GrowthAccelerator: {
    name: SubscriptionTypeNames.GrowthAccelerator,
    planId: SubscriptionPlanIdsSandbox.GrowthAccelerator,
    price: 225,
  },
  DealershipDominator: {
    name: SubscriptionTypeNames.DealershipDominator,
    planId: SubscriptionPlanIdsSandbox.DealershipDominator,
    price: 400,
  },
};
