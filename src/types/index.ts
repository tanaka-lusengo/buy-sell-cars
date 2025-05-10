/* eslint-disable @typescript-eslint/no-unused-vars */
import { type infer as ZodInfer } from 'zod';

import { signUpValidationSchema, signInValidationSchema } from '../schemas';

// Validation Schema Types
export type SignUpFormType = ZodInfer<typeof signUpValidationSchema>;

export type SignInFormType = ZodInfer<typeof signInValidationSchema>;
