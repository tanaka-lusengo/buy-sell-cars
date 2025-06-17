import { redirect } from "next/navigation";
import { AdminDashboardSidebar } from "@/src/components/Layout";
import { fetchUserAndProfile } from "@/src/server/actions/auth";

const AdminDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  // Only allow access if the user is an admin
  if (!profile.admin) {
    redirect("/");
  }

  return <AdminDashboardSidebar>{children}</AdminDashboardSidebar>;
};
export default AdminDashboardLayout;
