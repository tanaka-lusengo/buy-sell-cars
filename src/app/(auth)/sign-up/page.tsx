import { type Metadata } from 'next';
import { AuthLayout, SignUpForm } from '@/src/components/Pages';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign up for an account',
};

export default function SignUp() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
