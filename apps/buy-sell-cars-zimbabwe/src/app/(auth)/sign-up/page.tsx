import { type Metadata } from "next";
import { AuthLayout } from "~bsc-shared/components";
import { SignUpForm } from "@/src/components/Pages";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your account",
};

export default function SignUp() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
