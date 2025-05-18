/* eslint-disable @typescript-eslint/no-unused-vars */
import { type infer as ZodInfer } from 'zod';
import { Constants, Tables } from '@/database.types';
import {
  signUpValidationSchema,
  signInValidationSchema,
  updateProfileValidationSchema,
  addVehicleValidationSchema,
  subscribeValidationSchema,
} from '../schemas';

const {
  user_category_type,
  condition_type,
  fuel_type,
  gear_box_type,
  subscription_type,
  vehicle_category_type,
  listing_category_type,
} = Constants.public.Enums;

// Enum Types
export type CategoryType = typeof user_category_type;

export type ConditionType = typeof condition_type;

export type FuelType = typeof fuel_type;

export type GearBoxType = typeof gear_box_type;

export type SubscriptionType = typeof subscription_type;

export type VehicleCategoryType = typeof vehicle_category_type;

export type ListingCategoryType = typeof listing_category_type;

// Validation Schema Types

export type SubscribeFormType = ZodInfer<typeof subscribeValidationSchema>;

export type SignUpFormType = ZodInfer<typeof signUpValidationSchema>;

export type SignInFormType = ZodInfer<typeof signInValidationSchema>;

export type UpdateProfileFormType = ZodInfer<
  typeof updateProfileValidationSchema
>;

export type AddVehicleFormType = ZodInfer<typeof addVehicleValidationSchema>;

// Database Tables Types
export type Profile = Tables<'profiles'>;

export type Vehicle = Tables<'vehicles'>;

export type VehicleImage = Tables<'vehicle_images'>;

// Server Actions Types
export type AddVehicleDataType = Omit<
  Vehicle,
  'id' | 'created_at' | 'updated_at'
>;

export type AddVehicleImageDataType = Omit<VehicleImage, 'id' | 'created_at'>;

export type VehicleWithImage = Vehicle & {
  images: VehicleImage[];
};

// Storage Bucket Types
export type StorageBucket =
  | 'profile-logos'
  | 'vehicle-images'
  | 'spec-sheets'
  | 'government-ids';
