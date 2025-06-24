import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { AddListing } from "@/src/components/Pages/Dashboard";
import { PendingVerification } from "@/src/components/Pages/Dashboard/components";
import { fetchUserAndProfile } from "@/src/server/actions/auth";

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
