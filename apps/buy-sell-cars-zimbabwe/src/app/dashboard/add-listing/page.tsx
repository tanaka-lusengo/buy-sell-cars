import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { AddListing } from "@/src/components/Pages/Dashboard";
import { PendingVerification } from "@/src/components/Pages/Dashboard/components";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import { getProfileSubscriptionDetails } from "@/src/server/actions/general";
import { shouldAllowDashboardAccess } from "@/src/utils/vehicleVisibilityHelpers";

export const metadata: Metadata = {
  title: "Add Listing",
  description: "Add a new listing to your account",
};

const AddListingPage = async () => {
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

  return isVerified ? (
    <AddListing profile={profile} />
  ) : (
    <PendingVerification />
  );
};

export default AddListingPage;
