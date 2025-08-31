import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/src/components/Layout";
import { fetchUserAndProfile } from "@/src/server/actions/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return <DashboardSidebar>{children}</DashboardSidebar>;
};
export default DashboardLayout;
