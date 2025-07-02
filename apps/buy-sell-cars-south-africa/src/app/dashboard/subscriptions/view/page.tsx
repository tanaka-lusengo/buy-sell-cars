import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { SubscriptionsList } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";

export const metadata: Metadata = {
  title: "Subscriptions select | Your Account",
  description: "Manage your subscriptions and billing information",
};

const SubscriptionViewPage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return <SubscriptionsList profile={profile} />;
};

export default SubscriptionViewPage;
