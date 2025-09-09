import {
  SignUpFormType,
  SignInFormType,
  UpdateProfileFormType,
  AddVehicleFormType,
  Profile,
  EditVehicleFormType,
  VehicleWithImage,
} from "../types";

export const signInFormDefaultValues = {
  email: "",
  password: "",
} satisfies SignInFormType;

export const signUpFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  categoryType: undefined,
  dealershipName: null,
  location: "",
  address: "",
  password: "",
  confirmPassword: "",
  description: "",
  profileLogoPath: undefined,
} satisfies SignUpFormType;

export const updateProfileFormDefaultValues = (profile: Profile) => {
  return {
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    dealershipName: profile?.dealership_name || "",
    location: profile?.location || "",
    description: profile?.description || "",
    address: profile?.address || "",
  } satisfies UpdateProfileFormType;
};

export const addVehicleFormDefaultValues = {
  listingCategory: undefined,
  make: "",
  model: "",
  location: "",
  price: undefined,
  mileage: undefined,
  condition: undefined,
  year: undefined,
  fuelType: undefined,
  gearBox: undefined,
  vehicleCategory: undefined,
  doors: undefined,
  seats: undefined,
  description: "",
} satisfies Partial<AddVehicleFormType>;

export const updateVehicleFormDefaultValues = (vehicle: VehicleWithImage) => {
  return {
    listingCategory: vehicle?.listing_category || undefined,
    make: vehicle?.make,
    model: vehicle?.model,
    location: vehicle?.location || "",
    price: String(vehicle?.price),
    mileage: String(vehicle?.mileage),
    condition: vehicle?.condition,
    year: String(vehicle?.year),
    fuelType: vehicle?.fuel,
    gearBox: vehicle?.gear_box,
    vehicleCategory: vehicle?.vehicle_category || undefined,
    doors: String(vehicle?.doors),
    seats: String(vehicle?.seats),
    description: vehicle?.description || "",
  } satisfies EditVehicleFormType;
};
