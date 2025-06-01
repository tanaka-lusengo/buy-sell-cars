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

export enum SubscriptionTypeValues {
  StarterShowcase = "Starter Showcase",
  GrowthAccelerator = "Growth Accelerator",
  DealershipDominator = "Dealership Dominator",
}

export const SUBSCRIPTION_TYPES = [
  SubscriptionTypeValues.StarterShowcase,
  SubscriptionTypeValues.GrowthAccelerator,
  SubscriptionTypeValues.DealershipDominator,
];

export const SUBSCRIPTION_FEATURE_TYPES = [
  "Growth Accelerator",
  "Dealership Dominator",
];

export const SUBSCRIPTION_PLAN_MAPPING: Record<string, string> = {
  "P-780685339T092612HNA3VWYA": "Starter Showcase",
  "P-98477851NX466604ENA3VYTY": "Growth Accelerator",
  "P-09P4770066006133BNA3WGJY": "Dealership Dominator",
};
