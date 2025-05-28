import { GearBoxType, ConditionType, FuelType } from "@/src/types";
import * as z from "zod";

export const filterValidationSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  location: z.string().optional(),
  condition: z.enum(["new", "used"] satisfies ConditionType).optional(),
  fuelType: z
    .enum(["petrol", "diesel", "electric", "hybrid"] satisfies FuelType)
    .optional(),
  gearboxType: z.enum(["manual", "automatic"] satisfies GearBoxType).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});
