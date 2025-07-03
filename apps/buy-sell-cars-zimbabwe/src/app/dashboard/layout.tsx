import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/src/components/Layout";
import { SubscriptionsList } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import { getProfileSubscriptionDetails } from "@/src/server/actions/general";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const { data: subscription } = await getProfileSubscriptionDetails(
    profile.id
  );

  const hasPermission =
    profile?.admin || profile?.user_category === "individual" || !!subscription;

  return hasPermission ? (
    <DashboardSidebar>{children}</DashboardSidebar>
  ) : (
    <SubscriptionsList profile={profile} subscription={subscription} />
  );
};
export default DashboardLayout;
