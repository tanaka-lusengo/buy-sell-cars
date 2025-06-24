import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Account } from "@/src/components/Pages";
import { PendingVerification } from "@/src/components/Pages/Dashboard/components";
import { fetchUserAndProfile } from "@/src/server/actions/auth";

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
