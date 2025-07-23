import * as z from "zod";

export const filterValidationSchema = z.object({
  vehicleCategory: z
    .string()
    .min(1, { message: "Vehicle category is required" }),
  location: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  condition: z.string().optional(),
  fuelType: z.string().optional(),
  gearboxType: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});
