import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { SubscriptionsDashboard } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import { getSubscription } from "@/src/server/actions/payment";

export const metadata: Metadata = {
  title: "Subscriptions | Your Account",
  description: "Manage your subscriptions and billing information",
};

const SubscriptionsPage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  // Fetch the subscription details for the profile
  const { data: subscription, error } = await getSubscription(profile.id);

  if (error) {
    console.error("Failed to fetch subscription:", error);
  }

  return (
    <SubscriptionsDashboard profile={profile} subscription={subscription} />
  );
};

export default SubscriptionsPage;
