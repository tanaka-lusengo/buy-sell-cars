import * as z from 'zod';
import { CategoryType } from '../types';

export const signUpValidationSchema = z
  .object({
    firstName: z.string().min(2, {
      message: 'First name must be at least 2 characters',
    }),
    lastName: z.string().min(2, {
      message: 'Last name must be at least 2 characters',
    }),
    phone: z.string().min(5, { message: 'Enter a valid phone number' }),
    categoryType: z
      .enum(['individual', 'dealership'] satisfies CategoryType, {
        errorMap: () => ({ message: 'Category is required' }),
      })
      .optional(),
    dealershipName: z.string().nullable(),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Confirm password must be at least 8 characters',
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const signInValidationSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
});
