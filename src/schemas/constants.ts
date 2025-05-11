import { SignUpFormType, SignInFormType } from '../types';

export const signInFormDefaultValues = {
  email: '',
  password: '',
} satisfies SignInFormType;

export const signUpFormDefaultValues = {
  firstName: '',
  lastName: '',
  phone: '',
  categoryType: undefined,
  dealershipName: null,
  email: '',
  password: '',
  confirmPassword: '',
} satisfies SignUpFormType;
