import { type Metadata } from "next";
import { Performance } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import { redirect } from "next/navigation";
import { PendingVerification } from "@/src/components/Pages/Dashboard/components";

export const metadata: Metadata = {
  title: "Dashboard | Performance",
  description: "Your performance dashboard",
};

const PerformancePage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const isVerified = Boolean(profile.is_verified);

  return isVerified ? (
    <Performance profile={profile} />
  ) : (
    <PendingVerification />
  );
};

export default PerformancePage;
