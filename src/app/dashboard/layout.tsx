import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/src/components/Layout";
import { Subscriptions } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const hasPermission =
    profile?.admin ||
    profile?.user_category === "individual" ||
    Boolean(profile?.subscription);

  return !hasPermission ? (
    <DashboardSidebar>{children}</DashboardSidebar>
  ) : (
    <Subscriptions profile={profile} />
  );
};
export default DashboardLayout;
