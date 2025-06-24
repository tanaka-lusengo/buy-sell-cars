import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Security } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";

export const metadata: Metadata = {
  title: "Security | Your Account",
  description: "Manage your account security settings",
};

const SecurityPage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return <Security />;
};

export default SecurityPage;
