import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Account } from "@/src/components/Pages";
import { PendingVerification } from "@/src/components/Pages/Dashboard/components";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import { getProfileSubscriptionDetails } from "@/src/server/actions/general";
import { shouldAllowDashboardAccess } from "@/src/utils/vehicleVisibilityHelpers";

export const metadata: Metadata = {
  title: "Dashboard | Your Account",
  description: "Your account dashboard",
};

const AccountPage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  // Check subscription access control
  const { data: subscription } = await getProfileSubscriptionDetails(
    profile.id
  );

  if (!shouldAllowDashboardAccess(profile, subscription)) {
    redirect("/dashboard/subscriptions");
  }

  const isVerified = Boolean(profile.is_verified);

  return isVerified ? <Account profile={profile} /> : <PendingVerification />;
};

export default AccountPage;
