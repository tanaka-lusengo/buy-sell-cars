/* eslint-disable @typescript-eslint/no-unused-vars */
import { type infer as ZodInfer } from "zod";
import { Constants, Tables } from "@/database.types";
import {
  signUpValidationSchema,
  signInValidationSchema,
  updateProfileValidationSchema,
  addVehicleValidationSchema,
  editVehicleValidationSchema,
  subscribeValidationSchema,
  updatePasswordValidationSchema,
  updateProfileAdminValidationSchema,
} from "../schemas";

const {
  user_category_type,
  condition_type,
  fuel_type,
  gear_box_type,
  vehicle_category_type,
  listing_category_type,
} = Constants.public.Enums;

// Enum Types
export type CategoryType = typeof user_category_type;

export type ConditionType = typeof condition_type;

export type FuelType = typeof fuel_type;

export type GearBoxType = typeof gear_box_type;

export type VehicleCategoryType = typeof vehicle_category_type;

export type ListingCategoryType = typeof listing_category_type;

// Validation Schema Types
export type SubscribeFormType = ZodInfer<typeof subscribeValidationSchema>;

export type SignUpFormType = ZodInfer<typeof signUpValidationSchema>;

export type SignInFormType = ZodInfer<typeof signInValidationSchema>;

export type UpdatePasswordFormType = ZodInfer<
  typeof updatePasswordValidationSchema
>;

export type UpdateProfileFormType = ZodInfer<
  typeof updateProfileValidationSchema
>;

export type AddVehicleFormType = ZodInfer<typeof addVehicleValidationSchema>;

export type EditVehicleFormType = ZodInfer<typeof editVehicleValidationSchema>;

export type UpdateProfileAdminFormType = ZodInfer<
  typeof updateProfileAdminValidationSchema
>;

// Database Tables Types
export type Profile = Tables<"profiles">;

export type Vehicle = Tables<"vehicles">;

export type VehicleImage = Tables<"vehicle_images">;

export type Subscription = Tables<"subscriptions">;

// Server Actions Types
export type LogSubscriptionType = Omit<
  Subscription,
  "id" | "created_at" | "updated_at"
>;

export type LogSubscriptionWebhookType = Omit<
  Subscription,
  "id" | "created_at" | "start_time"
>;

export type AddVehicleDataType = Omit<
  Vehicle,
  "id" | "created_at" | "updated_at" | "is_feature"
>;

export type AddVehicleImageDataType = Omit<
  VehicleImage,
  "id" | "created_at" | "updated_at"
>;

export type EditVehicleDataType = Partial<
  Omit<Vehicle, "id" | "created_at" | "updated_at">
>;

export type VehicleWithImage = Vehicle & {
  images: VehicleImage[];
};

export type VehicleWithImageAndDealer = VehicleWithImage & {
  dealer: {
    id: string | null | undefined;
    dealership_name: string | null | undefined;
    profile_logo_path: string | null | undefined;
    subscription: string | null | undefined;
  };
};

// Storage Bucket Types
export type StorageBucket =
  | "profile-logos"
  | "vehicle-images"
  | "spec-sheets"
  | "government-ids";
