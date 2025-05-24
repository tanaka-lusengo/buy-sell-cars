import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/src/components/Layout";
import { Subscriptions } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const hasSubscription =
    Boolean(profile?.subscription) ||
    profile?.admin ||
    profile?.user_category === "individual";

  return hasSubscription ? (
    <DashboardSidebar>{children}</DashboardSidebar>
  ) : (
    <Subscriptions profile={profile} />
  );
};
export default DashboardLayout;
