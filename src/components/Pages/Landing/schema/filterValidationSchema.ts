import * as z from 'zod';

export const filterValidationSchema = z.object({
  location: z.string().min(3, { message: 'Enter a valid location' }),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  condition: z.string().optional(),
  fuelType: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});
