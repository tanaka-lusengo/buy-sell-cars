import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { SubscriptionsList } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import { getProfileSubscriptionDetails } from "@/src/server/actions/general";

export const metadata: Metadata = {
  title: "Subscriptions select | Your Account",
  description: "Manage your subscriptions and billing information",
};

const SubscriptionViewPage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  // get subscription from profile
  const { data: subscription, error } = await getProfileSubscriptionDetails(
    profile.id
  );

  if (error) {
    console.error(
      "[SubscriptionViewPage] Error fetching profile subscription details:",
      error
    );
  }

  return <SubscriptionsList profile={profile} subscription={subscription} />;
};

export default SubscriptionViewPage;
