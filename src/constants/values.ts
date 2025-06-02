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
  "Bulawayo",
  "Gweru",
  "Marondera",
  "Masvingo",
  "Mutare",
  "Msasa",
  "Ruwa",
  "Harare",
];

export const DEALER_LOGOS_TO_CONTAIN = [
  "Welly Motors",
  "August Auto Zimbabwe",
  "Willy's Auto Group",
  "JP Motors",
  "Kenmac motors",
];

// PayPal Subscription (Live) Values
export enum SubscriptionTypeValues {
  StarterShowcase = "Starter Showcase",
  GrowthAccelerator = "Growth Accelerator",
  DealershipDominator = "Dealership Dominator",
}

export enum SubscriptionPlanIds {
  StarterShowcase = "P-7CR55865728636303NA62GBQ",
  GrowthAccelerator = "P-20M87694HT3500238NA62GXQ",
  DealershipDominator = "P-2YN00444PF5235149NA62HHQ",
}

export const SUBSCRIPTION_TYPES = [
  SubscriptionTypeValues.StarterShowcase,
  SubscriptionTypeValues.GrowthAccelerator,
  SubscriptionTypeValues.DealershipDominator,
];

export const SUBSCRIPTION_PLAN_MAPPING: Record<string, string> = {
  "P-7CR55865728636303NA62GBQ": SubscriptionTypeValues.StarterShowcase,
  "P-20M87694HT3500238NA62GXQ": SubscriptionTypeValues.GrowthAccelerator,
  "P-2YN00444PF5235149NA62HHQ": SubscriptionTypeValues.DealershipDominator,
};

// To be used in the UI to display features based on subscription type
export const SUBSCRIPTION_FEATURE_TYPES = [
  SubscriptionTypeValues.GrowthAccelerator,
  SubscriptionTypeValues.DealershipDominator,
];

// PayPal Subscription (Sandbox) Values

export enum SandboxSubscriptionPlanIds {
  StarterShowcase = "P-780685339T092612HNA3VWYA",
  GrowthAccelerator = "P-98477851NX466604ENA3VYTY",
  DealershipDominator = "P-09P47700660006133BNA3WGJY",
}

export const SANDBOX_SUBSCRIPTION_PLAN_MAPPING: Record<string, string> = {
  "P-780685339T092612HNA3VWYA": SubscriptionTypeValues.StarterShowcase,
  "P-98477851NX466604ENA3VYTY": SubscriptionTypeValues.GrowthAccelerator,
  "P-09P47700660006133BNA3WGJY": SubscriptionTypeValues.DealershipDominator,
};
