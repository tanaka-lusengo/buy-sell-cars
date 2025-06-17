import * as z from "zod";

export const filterValidationSchema = z.object({
  location: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  condition: z.string().optional(),
  fuelType: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});
