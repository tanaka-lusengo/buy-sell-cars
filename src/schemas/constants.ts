import {
  SignUpFormType,
  SignInFormType,
  UpdateProfileFormType,
  AddVehicleFormType,
  Profile,
} from '../types';

export const signInFormDefaultValues = {
  email: '',
  password: '',
} satisfies SignInFormType;

export const signUpFormDefaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  categoryType: undefined,
  dealershipName: null,
  location: null,
  password: '',
  confirmPassword: '',
} satisfies SignUpFormType;

export const updateProfileFormDefaultValues = (profile: Profile) => {
  return {
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    dealershipName: profile?.dealership_name || '',
    location: profile?.location || '',
    description: profile?.description || '',
  } satisfies UpdateProfileFormType;
};

export const addVehicleFormDefaultValues = {
  listingCategory: undefined,
  make: '',
  model: '',
  location: '',
  price: undefined,
  mileage: undefined,
  condition: undefined,
  year: undefined,
  fuelType: undefined,
  gearBox: undefined,
  vehicleCategory: undefined,
  doors: undefined,
  seats: undefined,
  description: '',
  // vehicleImages: [],
  // specSheet: [],
} satisfies Partial<AddVehicleFormType>;
