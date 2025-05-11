import { AuthLayout, SignInForm } from '@/src/components/Pages';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default function SignIn() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
