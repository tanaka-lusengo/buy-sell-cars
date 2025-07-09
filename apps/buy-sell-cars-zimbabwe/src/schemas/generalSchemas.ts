import * as z from "zod";
import {
  ConditionType,
  FuelType,
  GearBoxType,
  VehicleCategoryType,
  ListingCategoryType,
} from "../types";

export const updateProfileValidationSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters",
  }),

  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters",
  }),
  phone: z.string().min(10, {
    message: "Enter a valid phone number",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  dealershipName: z.string().nullable(),
  location: z.string().nullable(),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  profileLogoPath: z.any().optional(),
  governmentIdPath: z.any().optional(),
});

export const updateProfileAdminValidationSchema = z.object({
  isVerified: z.string().optional(),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters",
  }),
  phone: z.string().min(10, {
    message: "Enter a valid phone number",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  dealershipName: z.string().nullable(),
  location: z.string().nullable(),
  description: z.string().nullable(),
  profileLogoPath: z.any().optional(),
  governmentIdPath: z.any().optional(),
});

export const addVehicleValidationSchema = z.object({
  listingCategory: z.enum(
    ["rental", "for_sale"] satisfies ListingCategoryType,
    {
      errorMap: () => ({ message: "Listing type is required" }),
    }
  ),
  make: z.string().min(2, {
    message: "Make must be at least 2 characters",
  }),
  model: z.string().min(2, {
    message: "Model must be at least 2 characters",
  }),
  location: z.string().min(2, {
    message: "Location is required",
  }),
  price: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val >= 1, { message: "Price be greater than $1" })
    .refine((val) => val <= 2000000, {
      message: "Price must be less than $2,000,000",
    })
    .transform((val) => String(val)),
  mileage: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val >= 1, { message: "Mileage be greater than 1" })
    .transform((val) => String(val)),
  condition: z.enum(["new", "used"] satisfies ConditionType, {
    errorMap: () => ({ message: "Condition is required" }),
  }),
  year: z.string().min(1, {
    message: "Year manufactured is required",
  }),
  fuelType: z.enum(
    ["petrol", "diesel", "electric", "hybrid"] satisfies FuelType,
    {
      errorMap: () => ({ message: "Fuel type is required" }),
    }
  ),
  gearBox: z.enum(["manual", "automatic"] satisfies GearBoxType, {
    errorMap: () => ({ message: "Gearbox type is required" }),
  }),
  vehicleCategory: z.enum(
    [
      "car_rental",
      "new_car",
      "used_car",
      "boat",
      "motorcycle",
      "truck",
      "agriculture",
      "earth_moving",
      "car",
      "bike",
    ] satisfies VehicleCategoryType,
    {
      errorMap: () => ({ message: "Vehicle category is required" }),
    }
  ),
  doors: z
    .string()
    .transform((val) => Number(val))
    .transform((val) => String(val)),
  seats: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val >= 1, { message: "Must be greater than 1" })
    .transform((val) => String(val)),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  vehicleImages: z.any().optional(),
  specSheetPath: z.any().optional(),
});

export const editVehicleValidationSchema = z.object({
  isActive: z.string().optional(),
  listingCategory: z
    .enum(["rental", "for_sale"] satisfies ListingCategoryType, {
      errorMap: () => ({ message: "Listing type is required" }),
    })
    .optional(),
  make: z
    .string()
    .min(2, {
      message: "Make must be at least 2 characters",
    })
    .optional(),
  model: z
    .string()
    .min(2, {
      message: "Model must be at least 2 characters",
    })
    .optional(),
  location: z
    .string()
    .min(2, {
      message: "Location is required",
    })
    .optional(),
  price: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val >= 1, { message: "Price be greater than $1" })
    .refine((val) => val <= 2000000, {
      message: "Price must be less than $2,000,000",
    })
    .transform((val) => String(val))
    .optional(),
  mileage: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val >= 1, { message: "Mileage be greater than 1" })
    .transform((val) => String(val))
    .optional(),
  condition: z
    .enum(["new", "used"] satisfies ConditionType, {
      errorMap: () => ({ message: "Condition is required" }),
    })
    .optional(),
  year: z
    .string()
    .min(1, {
      message: "Year manufactured is required",
    })
    .optional(),
  fuelType: z
    .enum(["petrol", "diesel", "electric", "hybrid"] satisfies FuelType, {
      errorMap: () => ({ message: "Fuel type is required" }),
    })
    .optional(),
  gearBox: z
    .enum(["manual", "automatic"] satisfies GearBoxType, {
      errorMap: () => ({ message: "Gearbox type is required" }),
    })
    .optional(),
  vehicleCategory: z
    .enum(
      [
        "car_rental",
        "new_car",
        "used_car",
        "boat",
        "motorcycle",
        "truck",
        "agriculture",
        "earth_moving",
        "car",
        "bike",
      ] satisfies VehicleCategoryType,
      {
        errorMap: () => ({ message: "Vehicle category is required" }),
      }
    )
    .optional(),
  doors: z
    .string()
    .transform((val) => Number(val))
    .transform((val) => String(val))
    .optional(),
  seats: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => val >= 1, { message: "Must be greater than 1" })
    .transform((val) => String(val))
    .optional(),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters",
    })
    .optional(),
  vehicleImages: z.any().optional(),
  specSheetPath: z.any().optional(),
});
