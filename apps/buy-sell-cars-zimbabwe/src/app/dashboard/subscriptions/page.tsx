import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { SubscriptionsDashboard } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";

export const metadata: Metadata = {
  title: "Subscriptions | Your Account",
  description: "Manage your subscriptions and billing information",
};

const SubscriptionsPage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return <SubscriptionsDashboard profile={profile} />;
};

export default SubscriptionsPage;
