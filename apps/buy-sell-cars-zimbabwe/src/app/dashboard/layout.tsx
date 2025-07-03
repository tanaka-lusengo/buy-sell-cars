import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/src/components/Layout";
import { SubscriptionsList } from "@/src/components/Pages";
import {
  fetchUserAndProfile,
  hasSubscription,
} from "@/src/server/actions/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const hasSub = await hasSubscription(profile.id);

  const hasPermission =
    profile?.admin || profile?.user_category === "individual" || hasSub;

  return hasPermission ? (
    <DashboardSidebar>{children}</DashboardSidebar>
  ) : (
    <SubscriptionsList profile={profile} />
  );
};
export default DashboardLayout;
