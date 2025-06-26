"use client";

import { useState } from "react";
import { ResponsiveContainer, Typography, Button } from "~bsc-shared/ui";
import {
  capitaliseFirstChar,
  formatDate,
  handleClientError,
  logErrorMessage,
} from "~bsc-shared/utils";
import { managePaystackSubscription } from "@/src/server/actions/payment";
import { Profile, Subscription } from "@/src/types";
import { Box, Flex } from "@/styled-system/jsx";
import { InfoFooter } from "../components";

type SubscriptionsDashboardProps = {
  profile: Profile;
  subscription: Subscription | null;
};

export const SubscriptionsDashboard = ({
  profile,
  subscription,
}: SubscriptionsDashboardProps) => {
  if (!profile) {
    return null;
  }

  const [isLoading, setIsLoading] = useState(false);

  const { user_category } = profile;

  const isIndividual = user_category === "individual";
  const subscriptionPlanName =
    subscription?.subscription_name || "No Plan Selected";

  const subscriptionPlan = isIndividual
    ? "Individual Plan (Free)"
    : subscriptionPlanName;

  const handleManageSubscription = async () => {
    if (!subscription?.subscription_code) {
      console.error(
        "No subscription code available for managing subscription."
      );
      return;
    }

    setIsLoading(true);

    try {
      const { data, status, error } = await managePaystackSubscription(
        subscription.subscription_code
      );

      if (!data || error || status !== 200) {
        console.error("Failed to manage subscription:", error);
        return;
      }

      window.open(data.link, "_blank", "noopener,noreferrer");
    } catch (error) {
      logErrorMessage(error, "subscribing to plan");
      handleClientError(
        "An unexpected error occurred while subscribing to the plan",
        "Please try again later or contact support if the issue persists."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveContainer>
      <Flex direction="column" padding="lg" gap="md">
        <Box>
          <Typography variant="h2">Subscription</Typography>

          <Typography>
            Manage your subscription plans and billing information here.
          </Typography>
        </Box>

        <Flex direction="column" gap="sm" paddingY="sm">
          <Typography variant="h4">
            Current Plan:{" "}
            <Typography
              as="span"
              color="primary"
              weight="bold"
              style={{ fontSize: "inherit" }}
            >
              {subscriptionPlan}
            </Typography>
          </Typography>

          <Typography>
            Subscription start:{" "}
            <strong>{formatDate(subscription?.start_time ?? "")}</strong>
          </Typography>
          <Typography>
            Status:{" "}
            <strong>{capitaliseFirstChar(subscription?.status ?? "")}</strong>
          </Typography>
        </Flex>

        <Flex gap="md">
          <Button type="button" onClick={handleManageSubscription}>
            {isLoading ? "Processing..." : "Manage Subscription"}
          </Button>
        </Flex>

        <InfoFooter />
      </Flex>
    </ResponsiveContainer>
  );
};
