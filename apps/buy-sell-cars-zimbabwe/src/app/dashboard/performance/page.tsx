import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Performance } from "@/src/components/Pages";
import { PendingVerification } from "@/src/components/Pages/Dashboard/components";
import { fetchUserAndProfile } from "@/src/server/actions/auth";

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
