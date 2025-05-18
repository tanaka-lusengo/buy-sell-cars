import * as z from 'zod';

export const filterValidationSchema = z.object({
  dealer: z.string().optional(),
  location: z.string().optional(),
});
