import { type Metadata } from "next";
import { Security } from "@/src/components/Pages";

export const metadata: Metadata = {
  title: "Security | Your Account",
  description: "Manage your account security settings",
};

const SecurityPage = async () => {
  return <Security />;
};

export default SecurityPage;
