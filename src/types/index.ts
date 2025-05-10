/* eslint-disable @typescript-eslint/no-unused-vars */
import { type infer as ZodInfer } from 'zod';
import { Constants, Tables } from '@/database.types';
import { signUpValidationSchema, signInValidationSchema } from '../schemas';

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
export type SignUpFormType = ZodInfer<typeof signUpValidationSchema>;

export type SignInFormType = ZodInfer<typeof signInValidationSchema>;

// Database Tables Types
export type Profile = Tables<'profiles'>;

export type Vehicle = Tables<'vehicles'>;

export type VehicleImage = Tables<'vehicle_images'>;
