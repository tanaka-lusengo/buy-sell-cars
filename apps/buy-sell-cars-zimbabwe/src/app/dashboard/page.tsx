import { type Metadata } from "next";
import { Account } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import { redirect } from "next/navigation";
import { PendingVerification } from "@/src/components/Pages/Dashboard/components";

export const metadata: Metadata = {
  title: "Dashboard | Your Account",
  description: "Your account dashboard",
};

const AccountPage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const isVerified = Boolean(profile.is_verified);

  return isVerified ? <Account profile={profile} /> : <PendingVerification />;
};

export default AccountPage;
