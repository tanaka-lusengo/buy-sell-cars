import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { SubscriptionsDashboard } from "@/src/components/Pages";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import { getAllVehiclesByOwnerId } from "@/src/server/actions/general";
import { getSubscription } from "@/src/server/actions/payment";

export const metadata: Metadata = {
  title: "Subscriptions | Your Account",
  description: "Manage your subscriptions and billing information",
};

const SubscriptionsPage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  // Fetch the subscription details and all vehicles for the profile
  const { data: subscription, error: subscriptionError } =
    await getSubscription(profile.id);
  const { data: vehicles, error: vehiclesError } =
    await getAllVehiclesByOwnerId(profile.id);

  if (subscriptionError || vehiclesError) {
    console.error(
      subscriptionError
        ? `Failed to fetch subscription: ${subscriptionError}`
        : `Failed to fetch vehicles: ${vehiclesError}`
    );
  }

  return (
    <SubscriptionsDashboard
      profile={profile}
      subscription={subscription}
      vehicles={vehicles || []}
    />
  );
};

export default SubscriptionsPage;
