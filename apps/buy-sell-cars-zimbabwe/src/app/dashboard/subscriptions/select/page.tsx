import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Subscriptions } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";

export const metadata: Metadata = {
  title: "Subscriptions select | Your Account",
  description: "Manage your subscriptions and billing information",
};

const SubscriptionSelectPage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const hasPermission =
    profile?.admin ||
    profile?.user_category === "individual" ||
    Boolean(profile?.subscription);

  if (!hasPermission) {
    redirect("/dashboard/subscriptions");
  }

  return <Subscriptions profile={profile} />;
};

export default SubscriptionSelectPage;
