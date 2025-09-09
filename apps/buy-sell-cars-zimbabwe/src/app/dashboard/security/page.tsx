import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Security } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import { getProfileSubscriptionDetails } from "@/src/server/actions/general";
import { shouldAllowDashboardAccess } from "@/src/utils/vehicleVisibilityHelpers";

export const metadata: Metadata = {
  title: "Security | Your Account",
  description: "Manage your account security settings",
};

const SecurityPage = async () => {
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

  return <Security />;
};

export default SecurityPage;
