import { type Metadata } from "next";
import { AddListing } from "@/src/components/Pages/Dashboard";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import { redirect } from "next/navigation";
import { PendingVerification } from "@/src/components/Pages/Dashboard/components";

export const metadata: Metadata = {
  title: "Add Listing",
  description: "Add a new listing to your account",
};

const AddListingPage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const isVerified = Boolean(profile.is_verified);

  return isVerified ? (
    <AddListing profile={profile} />
  ) : (
    <PendingVerification />
  );
};

export default AddListingPage;
