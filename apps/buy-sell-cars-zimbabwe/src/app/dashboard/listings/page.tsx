import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Listings } from "@/src/components/Pages";
import { PendingVerification } from "@/src/components/Pages/Dashboard/components";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import {
  getAllVehiclesByOwnerId,
  getProfileSubscriptionDetails,
} from "@/src/server/actions/general";

export const metadata: Metadata = {
  title: "Listings | Your Vehicles",
  description: "View and manage your vehicle listings",
};

const ListingsPage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const { data, error, status } = await getAllVehiclesByOwnerId(profile.id);

  const {
    data: profileSubData,
    status: profileSubStatus,
    error: profileSubError,
  } = await getProfileSubscriptionDetails(profile.id);

  const profileSubscription = profileSubData?.subscription_name;

  const isVerified = Boolean(profile.is_verified);

  return isVerified ? (
    <Listings
      profile={profile}
      profileSubscription={profileSubscription}
      subscription={profileSubData}
      vehicles={data || []}
      error={error || profileSubError}
      status={status || profileSubStatus}
    />
  ) : (
    <PendingVerification />
  );
};

export default ListingsPage;
