import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Listings } from "@/src/components/Pages";
import { PendingVerification } from "@/src/components/Pages/Dashboard/components";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import { getAllVehiclesByOwnerId } from "@/src/server/actions/general";

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

  const isVerified = Boolean(profile.is_verified);

  return isVerified ? (
    <Listings
      profile={profile}
      vehicles={data || []}
      error={error}
      status={status}
    />
  ) : (
    <PendingVerification />
  );
};

export default ListingsPage;
